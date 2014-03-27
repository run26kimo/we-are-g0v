$(document).ready(function () {
  $.ajaxSetup({
      cache: true
  });
  $.getScript('//connect.facebook.net/zh_TW/all.js', function () {
      // Load the APP / SDK
      FB.init({
          appId: 'XXXX', // App ID from the App Dashboard
          cookie: true, // set sessions cookies to allow your server to access the session?
          xfbml: true, // parse XFBML tags on this page?
          frictionlessRequests: true,
          oauth: true
      });

      FB.login(function (response) {
          if (response.authResponse) {
            window.authToken = response.authResponse.accessToken;
            
            // FB.api('/me', function(response) {
            //   var input = $("input[ng-model=name]");
            //   input.val(response.name);
            //   input.trigger('input');
            // });
          } else {

          }
      }, {
          scope: 'publish_actions,publish_stream'
      });

  });

  // Populate the canvas
  // var c = document.getElementById("c");
  // var ctx = c.getContext("2d");
  // ctx.font = "20px Georgia";
  // ctx.fillText("This will be posted to Facebook as an image", 10, 50);

});
// Post a BASE64 Encoded PNG Image to facebook
function PostImageToFacebook(authToken) {
  $("#upload_to_fb").addClass("loading");
  var canvas = document.getElementById("c");
  var imageData = canvas.toDataURL("image/png");
  try {
      blob = dataURItoBlob(imageData);
  } catch (e) {
      console.log(e);
  }
  var fd = new FormData();
  fd.append("access_token", authToken);
  fd.append("source", blob);
  fd.append("message", "支持反服貿封面產生器 "+ window.location.href);
  try {
      $.ajax({
          url: "https://graph.facebook.com/me/photos?access_token=" + authToken,
          type: "POST",
          data: fd,
          processData: false,
          contentType: false,
          cache: false,
          success: function (data) {
            // console.log("success " + data);
            // $("#poster").html("Posted Canvas Successfully");
          },
          error: function (shr, status, data) {
            console.log("error " + data + " Status " + shr.status);
          },
          complete: function () {
            $("#upload_to_fb").removeClass("loading");
            $("#success_message").show();
          }
      });

  } catch (e) {
      console.log(e);
  }
}

// Convert a data URI to blob
function dataURItoBlob(dataURI) {
var byteString = atob(dataURI.split(',')[1]);
var ab = new ArrayBuffer(byteString.length);
var ia = new Uint8Array(ab);
for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
}
return new Blob([ab], {
    type: 'image/png'
});
}
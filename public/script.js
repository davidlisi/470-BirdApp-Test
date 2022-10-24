// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDpaJvmBHDTehZhr_7wbslth__vBWeO9ck",
  authDomain: "birdapp-database.firebaseapp.com",
  projectId: "birdapp-database",
  storageBucket: "birdapp-database.appspot.com",
  messagingSenderId: "547877297080",
  appId: "1:547877297080:web:bccd67d562776d8bb34d4d"
};






// Initialize Firebase
const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
let db = rtdb.getDatabase(app);
//--------------------------StartScreen----------------------------------

let logoutfunc = () => {
  firebase.auth().signOut();
  location.reload();
}

let startscreen = () => {

  $(".startscreen").show();
  $(".homescreen").hide();
  $(".logout").hide();
  $(".newpost").hide();
  $(".updateprof").hide();

  //Login
  $("#loginbutton").on('click', ()=> {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        homescreen(user);
      } else {
        renderlogin();
      }
    });
  })

  //If SignOut
  $("#signout").on('click', ()=> {
      logoutfunc();
  })

} //startscreen function

//----------------RenderLogin-------------------------------------------
let renderlogin = ()=>{
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      var credential = result.credential;
      var token = credential.accessToken;
      var user = result.user;
  }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
  });
}
//---------------------------------------------------------------------

let homescreen = (user) => {
  $(".startscreen").hide();
  $(".homescreen").show();


  //If SignOut
  $("#logout").on('click', () => {
    logoutfunc();
  })

  $("#posthere").on('click', () =>{
       var tweet = $("#post").val();
       var handle = user.displayName;
       var userid = user.uid;
       var likes = 0;
       var profile = {
       Username: handle,
       Tweet: tweet,
       UserID: userid,
       Likes: likes,
    }
    let profileref = rtdb.ref(db, "/Tweets");
    let newprofileref = rtdb.push(profileref);
    rtdb.set(newprofileref, profile);

    //timeline
    let timelineref = rtdb.ref(db, "/Tweets");
    let renderTweet = (tObj, key)=>{
      $(".lookaround").show();
      $(".lookaround").prepend(`
        <div class="card">
          <div class="card-header">
            BirdPost
          </div>
          <div class="card-body">
            <blockquote class="blockquote mb-0">
              <p> User: ${tObj.Username} </p>
              <p> -${tObj.Tweet} </p>
              <p class = "card-text like-button" data-tweetid = "${key}"> ${tObj.likes} Like</p>
            </blockquote>
          </div>
        </div>
        <br>
        `);
    }
    $(".lookaround").empty();
    rtdb.onChildAdded(timelineref, (ss)=>{
    let tObj = ss.val();
    renderTweet(tObj, ss.key);
   });
    $(".homescreen").hide();
    $(".newpost").show();
    $(".logout").show();

    //Like message
    $



    $("#newpost").on('click', () => {
      $(".lookaround").empty();
      logoutfunc();
    })
      })

  $("#updateprof").on('click', () => {
    $(".updateprof").show();
    $(".lookaround").hide();
    $(".newpost").hide();
    $(".homescreen").hide();
    /*
    var handleref = firebase.database().ref().child("/Tweets").child(user.displayName);
    $(".newhandle").on('click', () => {
      var nhandle = $("#handletext").val();
      var newhandle = {
        displayName: nhandle,
      }
      rtdb.update(handleref, newhandle);
    })
    */
    $("#returnhome").on('click', () => {
      location.reload();
      startscreen();
    })
  })

//-----------------------------------------------------------

} //homescreen main

startscreen();

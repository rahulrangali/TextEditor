import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';


Template.editor.helpers({
  docid:function () {
    setupCurrentDocument();
    return Session.get("docid");
  },
  config: function(){
    return function(editor){
      editor.setOption("lineNumbers",true);
      editor.setOption("theme","cobalt");
      editor.on("change", function(cm_editor,info){
        $("#viewer_iframe").contents().find("html").html(cm_editor.getValue());
        Meteor.call("addEditingUser");
      });
    }
  },
});


Template.editingUsers.helpers({
  users:function(){
    var doc,eusers,users;
    doc = Documents.findOne();
    if(!doc){return;}
    eusers = EditingUsers.findOne({docid:doc._id});
    if(!eusers){return;}
    users = new Array();
    var i=0;
    for(var user_id in eusers.users){
      users[i] = fixObjectKeys(eusers.users[user_id]);
      i++;
    }
    return users;
  }
});


Template.navbar.helpers({
  documents:function(){
    return Documents.find();
  }
});


Template.navbar.events({
  "click .js-add-doc": function(event){
    event.preventDefault();
    if(!Meteor.user()){
      alert("You need to login");
    }else{
      var id = Meteor.call("addDoc",function(err,res){
        if(!err){
          Session.set("docid",res);
          console.log("recvdid"+res);
        }
      });
    }
  },
  
  "click .js-load-doc":function(event){
    Session.set("docid",this._id);
  }
});


Template.docMeta.helpers({
  document:function(){
    return Documents.findOne({_id:Session.get("docid")});
  }
})


Template.docMeta.events({
  "click .js-tog-private":function(event){
    console.log(event.target.checked);
    var doc =  {_id:Session.get("docid"), isPrivate:event.target.checked};
    Meteor.call("updateDocPrivacy",doc);
  }
})


Template.editableText.helpers({
  userCanEdit:function(doc,Collection){
    doc = Documents.findOne({_id:Session.get("docid"),owner:Meteor.userId()});
    if(doc){
      return true;
    }else{
      return false;
    }
  }
})


function setupCurrentDocument(){
  var doc;
  if(!Session.get("docid")){
    doc=Documents.findOne();
    if(doc){
      Session.set("docid",doc._id);
    }
  }
}

function fixObjectKeys(obj){
  var newObj = {};
  for(key in obj){
    var key2 = key.replace("-","");
    newObj[key2] = obj[key];
  }
  return newObj;
}

import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  if(!Documents.findOne()){
    Documents.insert({title:"my new document"});
  }
});

const nodemailer = require('nodemailer');
//const config = require('../config/mailer');

const transport = nodemailer.createTransport({
  service : 'mailgun',
  auth : {
    user : 'postmaster@sandbox602dbdde9cbe4565bfe7a1bfb764f30a.mailgun.org',
    pass : 'f98924a6205cb89cb3955e410883c596      '
  },
  tls: {
    rejectUnauthorized : false
  }
});


module.exports = {
  sendMail(from,to,subject,html){
    return new Promise((resolve,reject) => {
      transport.sendMail({from,subject,to,html}, (err,info) => {
        if(err){
          reject(err);
        }
        resolve(info);
      });
    });
  }
}

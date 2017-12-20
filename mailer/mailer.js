const nodemailer = require('nodemailer');
//const config = require('../config/mailer');

const transport = nodemailer.createTransport({
  service : 'Gmail',
  auth : {
    user : 'shahrohan116@gmail.com',
    pass : 'foreverrohan'
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

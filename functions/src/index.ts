import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const db=admin.firestore();

// Sendgrid configration 
import * as sgMail from '@sendgrid/mail';

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY)

// 応募者が応募したらメールがいく
// send a mail to the applicants whenever they make an entry from entry form 
export const newComment = functions.firestore.document('registration/{registrationId}').onCreate( async (change, context)=>{
 
    // read the registration document
    const postSnap = await db.collection('registration').doc(context.params.registrationId).get();
  
    // Raw Data
    const registration = postSnap.data() || {};
    
    // format the message
    const msg = {
        to : registration.email,
        from :'haratakayasu@raisondetre.tokyo',
        templateId:TEMPLATE_ID,
        dynamic_template_data:{
            subject: `${registration.fullName}　様ご応募ありがとうございました。`,
            name:registration.fullName,
            text:'ニルバーナコンサルタントからのお便り',
        },
    };

    // and then just simply send it 
    return sgMail.send(msg);

});


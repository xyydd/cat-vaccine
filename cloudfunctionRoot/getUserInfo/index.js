const cloud = require('wx-server-sdk');
cloud.init({
  env: 'dev-7g313d3r179dfe1c'
});
const db = cloud.database();
const _ = db.command;

exports.main = async () => {
  return new Promise((resolve, reject) => {
    let { OPENID } = cloud.getWXContext()
    db.collection('Users').where({
      openid: _.eq(OPENID)
    }).get({
      success: res => {
        resolve(res)
      },
      fail: error => {
        console.log(error)
        reject('失败失败')
      }
    })
  })
}

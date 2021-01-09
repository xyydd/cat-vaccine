// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-7g313d3r179dfe1c'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise((resolve, reject) => {
    const {id, image, catName, gender, weight, birthday} = event
    let { OPENID } = cloud.getWXContext()
    if (image) {
      cloud.callFunction({
        name: 'uploadCatAvatar',
        data: {
          image: image,
          path: 'catAvatar'
        }
      })
        .then(res => {
          console.log('图片上传成功')
          console.log(res)
          db.collection('Cats').doc(id).update({
            data: {
              avatarUrl: res.result.fileID,
              birthday: birthday,
              openid: OPENID,
              catName: catName,
              gender: gender,
              weight: weight
            }
          })
            .then(rs => {
              console.log('添加成功')
              resolve(rs)
            })
            .catch(er => {
              console.log('添加失败', er)
              reject(er)
            })
        })
        .catch(error => {
          console.log('添加失败', error)
          reject(error)
        })
    } else {
      db.collection('Cats').doc(id).update({
        data: {
          openid: OPENID,
          birthday: birthday,
          catName: catName,
          gender: gender,
          weight: weight
        }
      })
        .then(rs => {
          console.log('编辑成功')
          resolve(rs)
        })
        .catch(er => {
          console.log('编辑成功', er)
          reject(er)
        })
    }
  })
}

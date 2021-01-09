// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-7g313d3r179dfe1c'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise(async (resolve, reject) => {
    const {image, catName, gender, weight, birthday} = event
    let { OPENID } = cloud.getWXContext()
    const avatarArr = [
      'cloud://dev-7g313d3r179dfe1c.6465-dev-7g313d3r179dfe1c-1304701411/catAvatar/c2bc3944dfa5256699c23511f156d20.jpg',
      'cloud://dev-7g313d3r179dfe1c.6465-dev-7g313d3r179dfe1c-1304701411/catAvatar/1950def3c0b90d4c479165a5128ddae.jpg'
    ]
    // console.log(event)
    // resolve()
    if (image !== '') {
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
          db.collection('Cats').add({
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
      const r = Math.floor(Math.random()*2)
      db.collection('Cats').add({
        data: {
          avatarUrl: avatarArr[r],
          openid: OPENID,
          birthday: birthday,
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
    }
  })
}

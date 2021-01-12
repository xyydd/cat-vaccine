// 云函数入口文件
const cloud = require('wx-server-sdk')
const moment = require('moment')
cloud.init({
  env: 'dev-7g313d3r179dfe1c'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise((resolve, reject) => {
    const { OPENID } = cloud.getWXContext()
    if (event.type !== 'weight') {
      const { catId, type, date, nextDate, insectRepellentType, vaccinetype, code, codeImage, isSub } = event
      // console.log(moment(nextDate, 'YYYY-MM-DD').toDate())
      if (codeImage !== '') {
        cloud.callFunction({
          name: 'uploadCatAvatar',
          data: {
            image: codeImage,
            path: 'codeImage'
          }
        })
          .then(res => {
            db.collection('Records').add({
              data: {
                openid: OPENID,
                isSub: isSub,
                codeImage: res.result.fileID,
                catId: catId,
                type: type,
                date: date,
                nextDate: moment(nextDate, 'YYYY-MM-DD').toDate(),
                insectRepellentType: insectRepellentType,
                vaccinetype: vaccinetype,
                code: code
              }
            })
              .then(res => {
                console.log(res)
                resolve(res)
              })
              .catch(error => {
                console.log('插入记录', error)
                reject(error)
              })
          })
          .catch(err => {
            console.log('上传图片', err)
            reject(err)
          })
      } else {
        db.collection('Records').add({
          data: {
            codeImage: '',
            openid: OPENID,
            isSub: isSub,
            catId: catId,
            type: type,
            date: date,
            nextDate: moment(nextDate, 'YYYY-MM-DD').toDate(),
            insectRepellentType: insectRepellentType,
            vaccinetype: vaccinetype,
            code: code
          }
        })
          .then(res => {
            console.log(res)
            resolve(res)
          })
          .catch(error => {
            console.log('插入记录', error)
            reject(error)
          })
      }
    } else {
      db.collection('Records').add({
        data: {
          openid: OPENID,
          weight: event.weight,
          isSub: false,
          catId: event.catId,
          type: 'weight',
          date: event.date
        }
      })
        .then(res => {
          console.log(res)
          resolve(res)
        })
        .catch(error => {
          console.log('插入记录', error)
          reject(error)
        })
    }
  })
}

// 云函数入口文件
const cloud = require('wx-server-sdk')
const moment = require('moment')
cloud.init({
  env: 'dev-7g313d3r179dfe1c'
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise((resolve, reject) => {
    const t = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate()
    const m = moment(moment().add(1, 'days').format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate()
    db.collection('Records').where({
      type: _.neq('weight'),
      nextDate: _.and(_.lte(m), _.gt(t))
    }).get()
      .then(res => {
        const records = res.data
        console.log(records)
        sendMessage(records)
        resolve(true)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })
}

async function sendMessage (records) {
  for (let i = 0; i < records.length; i++) {
    // console.log(records[i])
    if (records[i].isSub) {
      const record = records[i]
      let msg = ''
      let cat = await getCat(record.catId)
      if (record.type === 'vaccine') {
        msg = '该打疫苗啦'
      } else {
        msg = '该驱虫啦'
      }
      console.log(cat.catName, msg, moment(record.nextDate).format('YYYY-MM-DD'))
      cloud.openapi.subscribeMessage.send({
        touser: record.openid,
        page: `/page/catDetail/main?id=${record._id}`,
        lang: 'zh_CN',
        data: {
          thing1: {
            value: cat.data.catName + '小可爱' + msg
          },
          time2: {
            value: moment(record.nextDate).format('YYYY-MM-DD')
          }
        },
        templateId: 'vHIAsfMykxzfLh2vzuV4tllncKyDbvoYwLba1ltgiLA'
      })
        .then(res => {
          console.log('发送成功', res)
        })
        .catch(err => {
          console.log('发送失败', err)
        })
    }
  }
}

async function getCat (catId) {
  return await db.collection('Cats').doc(catId).get()
}

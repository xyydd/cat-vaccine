import moment from 'moment'

function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function getTempFile (fileIds) {
  return new Promise((resolve, reject) => {
    // debugger
    // 对全局临时文件链接数组进行时间筛选和删除
    let tempFileList = mpvue.$tempFileList.filter(item => {
      return item.expiredTime.isAfter(moment())
    })
    mpvue.$tempFileList = tempFileList
    // 选出已经存在且没有过期的临时文件链接，并删除fileIds中对应的元素
    const cFileList = []
    for (let i = 0; i < tempFileList.length; i++) {
      const item = tempFileList[i]
      for (let j = 0; j < fileIds.length; j++) {
        if (fileIds[j] === item.fileID) {
          cFileList.push(item)
          fileIds.splice(j, 1)
          break
        }
      }
    }
    if (fileIds && fileIds.length > 0) {
      mpvue.cloud.getTempFileURL({
        fileList: fileIds
      }).then(res => {
        // get temp file URL
        if (res.fileList.length > 0) {
          mpvue.$tempFileList.push(...res.fileList.map(item => {
            return {
              expiredTime: moment().add(2, 'hours'),
              fileID: item.fileID,
              tempFileURL: item.tempFileURL
            }
          }))
        }
        resolve([...res.fileList, ...cFileList])
      }).catch(error => {
        // handle error
        reject(error)
      })
    } else {
      resolve(cFileList)
    }
  })
}
export function mergeTempFile (data, fileList, field = 'avatarUrl') {
  let cloneList = Array.prototype.slice.apply(fileList)
  for (let i = 0; i < data.length; i++) {
    const fileId = data[i][field]
    let j = 0
    for (j = 0; j < cloneList.length; j++) {
      if (fileId === cloneList[j].fileID) {
        data[i][field] = cloneList[j].tempFileURL
        break
      }
    }
    cloneList.splice(j, 1)
  }
  return data
}

export default {
  formatNumber,
  formatTime,
  getTempFile,
  mergeTempFile
}

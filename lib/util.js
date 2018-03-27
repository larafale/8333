import { Observable } from 'rxjs'


export const RxfromIO = (io, eventName) => 
  Observable.create(observer => {
    const handler = function(data) { observer.next(data) }
    io.on(eventName, handler)
    return ()=>{ io.off(eventName, handler) }  
  })

Number.prototype.money = function(symbol = "$", places = 2, thousand = ".", decimal = ",") {
  var number = this,
      negative = number < 0 ? "-" : "",
      i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
      j = (j = i.length) > 3 ? j % 3 : 0;
  return symbol 
    + negative 
    + (j ? i.substr(0, j) + thousand : "") 
    + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) 
    + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}


export const copy2clipboard = text => {
  if (window.clipboardData && window.clipboardData.setData) {
    return clipboardData.setData("Text", text) // IE specific code path to prevent textarea being shown while dialog is visible.
  } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    var textarea = document.createElement("textarea")
    textarea.textContent = text
    textarea.style.position = "fixed" // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea)
    textarea.select()
    try { return document.execCommand("copy") } // Security exception may be thrown by some browsers.
    catch (ex) { console.warn("Copy to clipboard failed.", ex); return false } 
    finally { document.body.removeChild(textarea) }
  }
}

// f('abcdefg', '*', 2) => 'ab***fg'
export const truncateCenter = (s = '', del = '...', size = 2) => s.substr(0, size) + del + s.substr(s.length - size, s.length)


export const urlQuery = (name, url) => {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, "\\$&")
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)")
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, " "))
}




export const setErrors = (body, selector) => {
  const { errors } = body 
  const target = $(selector)

  // clear errors
  target
    .find('.has-danger')
    .removeClass('has-danger')
  target
    .find('.err-alert')
    .addClass('d-none')
  
  // set errors
  Object.keys(errors).forEach((key, i) => {
    const path = errors[key].path
    const message = errors[key].message
    const input = target.find(`[name="${path}"]`)
    // console.log(`debug: $('${selector}').find('input[name="${path}"]').parents('.form-group')`)

    // focus first input, disabled for now because we can't see red border when focused
    // if(input && i==0) input.focus()
    input.removeClass('pulse')
    setTimeout(()=>input.addClass('animated pulse'), 300)

    // add danger class to parent 
    input && input.parents('.form-group:eq(0)')
      .addClass('has-danger')

    // add danger class to parent 
    input && message && input.parents('.form-group:eq(0)')
      .find( ".err-alert" )
      .removeClass('d-none')
      .find( ".err-message" )
      .html(message)
  })
}

// Cloudinary
export const cloudinaryUrl = (id) => {
  return /(^http|^https)/.test(id)
    ? id
    : `https://res.cloudinary.com/inmemori/image/upload/${id}.png`
}

export const cloudinaryUpload = async (file, preset = 'profile', size = 5) => {
  const presets = { profile: 'gpjb3xkt', memory: 'oywdbnyz' }
  const url = `https://api.cloudinary.com/v1_1/inmemori/image/upload`
  if(bytesToMB(file.size) > size) return alert(`Maximum file size: ${size}Mo`)

  const formData = new FormData()
  formData.append('upload_preset', presets[preset])
  formData.append('file', file)

  try { return await (await fetch(url, { method: 'post', body: formData })).json() }
  catch(e) { return {} }
}
// this method need to be signed
export const cloudinaryDownload = async () => {
  const url = `https://api.cloudinary.com/v1_1/inmemori/image/generate_archive`

  const formData = new FormData()
  formData.append('mode', 'download')
  formData.append('public_ids', 'mockup_j3gzn4')

  try { return await (await fetch(url, { method: 'post', body: formData })).json() }
  catch(e) { return {} }
}

// CSS
export const spinOff = (el) => () => {
  el.removeClass('disabled')
  el.find('i:eq(0)').addClass('d-none')
  el.find('i:eq(1)').removeClass('d-none')
}
export const spinOn = (el) => {
  el.addClass('disabled')
  el.find('i:eq(0)').removeClass('d-none')
  el.find('i:eq(1)').addClass('d-none')
}


// Miscs
export const capitalize = (str = '') => str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()})

export const bytesToMB = (bytes) => (bytes / (1024*1024)).toFixed(2)

export const formatBytes = (a,b) => {if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}

export const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  if (i === 0) return `${bytes} ${sizes[i]})`
  return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}


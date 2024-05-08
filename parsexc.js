
const axios = require("axios");
// https://pptr.dev/
const puppeteer = require('puppeteer');
const path = require("path");
const fs = require("fs");


const cookie = {
    path: '/',
    expires: 1749697610.689307,
    domain: 'km.sankuai.com',
    httpOnly: false,
    secure: false,
    session: false,
    priority: 'Medium',
    sameParty: false,
    sourceScheme: 'Secure'
}

const ct_token = 'eAGFj70vQ1EcQHNDRMTQdBLTGwxth5f3u-9-vGtSpDH6ColF7rv3d6Up7fAqFoN2wiQSgglpIqmv2MwGf4HYDejChohFRcz2k5Nzukmqeb5OvLWbl-Y70H5TWfITXS4t66JfrPqorW-KVW1xcdCzVlmOgKG1mhnuFOWQE1aHBsBqxYe_SDo7i_GUwTKuhhBElHMYlYLyoJDPD0MIlNO8YkwVJPdeP7buPyFD6L_i6CdxqHfs7vls5w3Gb_dquw9QJ7meronJkYrFdPqxcdK6OnraOH0-rLUuGq3LWl-nt3a9n838wtuk-y_sgPiGUeY4qigOAseFdlaqCJyxDgPTPpsHGSgJwIUIQ3lMBlYwXnUGtTbcMKEUQweRjqlT2jGNRsg4mvOkZTJ2PALMcWYVb-uZ06ESIkJlnaqT1AJW88ZgkkxXSlieoZukI0kq37NSg18**eAENycEBwCAIA8CVAEl0HQpx_xHsfS9tleZTYSGdkpvTFRvwCPL-advqttg4cYABczSm4fQDNHMR1Q**F5PMv05OR08_XxfOmTE2IJYOtv_HtZjgWYH4Q7H5V955B4DQCFPQ1np2YBunr9xnBjRUvQKmhULYwdVmerV8gQ**MjIzNDAyNix5YW5nZ3VhbmcxMSzmnajlhYkseWFuZ2d1YW5nMTFAbWVpdHVhbi5jb20sMSwwMzA2MDI4MywxNzE1MzkyNDM4NTI4'
const webNewUuid = 'c424f5e98b00f56afd7981fcdfe0c4c5_1709711566337'
const moaDeviceId = '31082551D76250FAAB131252A9449F75'
const logan_session_token = 'bjjz9n40e4hz5du0v3ij'
const ct_misid = 'yangguang11'

function getCookie() {
    return [{
        ...cookie,
        name: 'ct_token',
        value: ct_token,
    },{
        ...cookie,
        name: 'com.sankuai.it.ead.citadel_ssoid',
        value: ct_token,
    },{
        ...cookie,
        name: 'webNewUuid',
        value: webNewUuid,
    },
    {
        ...cookie,
        name: 'moaDeviceId',
        value: moaDeviceId,
    },
    {
        ...cookie,
        name: 'logan_session_token',
        value: logan_session_token,
    },
    {
        ...cookie,
        name: 'ct_misid',
        value: ct_misid,
    }]
}

async function getByClass(url, startindex) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setCookie(...getCookie());
    await page.goto(url);
    await page.waitForNetworkIdle()

    let element = await page.$('.ct-title-p')
    if(!element) {
        console.log('出错了，没找到标题');
        return
    }
    let classtitle = await page.evaluate(el=>el.textContent, element)
    
    // 如果没有该文件夹，则创建
    const dirpath = path.join(__dirname, 'data', classtitle)
    if(!fs.existsSync(dirpath)) {
        console.log('guangy 创建文件夹 ', classtitle);
        fs.mkdirSync(dirpath)
    }


    const array = await page.$$eval("a.item-link", el => el.map(x => x.getAttribute("href")));
    console.log('成功获取到目录信息：共', array.length, '个');

    for(let i = startindex; i <array.length ; i++) {
        await page.goto(`https://km.sankuai.com${array[i]}`);
        await page.waitForNetworkIdle()
        // 获取标题
        let element = await page.$('.ct-title-p')
        if(!element) {
            console.log('出错了，没找到标题');
            continue
        }
        let title = await page.evaluate(el => el.textContent, element)
        console.log('guangy title ', title);
        let iframenode = await page.$('.ct-frame')
        if(!iframenode) {
            console.log('出错了，没找到iframe');
            continue
        }
        let iframe = await iframenode.contentFrame()
        const content = await iframe.content()
        const filepath = path.join(dirpath, `${i}${title.replace(/[\s\d｜]/g,'')}.html`)
        if(fs.existsSync(filepath)) {
            console.log('文件已存在，跳过');
            continue
        }
        fs.writeFileSync(filepath, content)
        console.log('guangy 文件写入成功', filepath);
        
    }
    

    
    await browser.close();
    

}

async function main(){
    // node ./parsexc.js 922763211 5
    // 第一个参数是目录页的url上数字，第二个参数是之前中断的位置
    const args = process.argv
    const fileindex = parseInt(args[2])
    const startindex = parseInt(args[3]) || 0

   await getByClass(`https://km.sankuai.com/page/${fileindex}`, startindex)

}

main()
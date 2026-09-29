import{test, expect} from '@playwright/test'
import exceldata from 'xlsx'
import jsondata from 'fs'

test.describe("Test Scenario on Adding Multiple employees", ()=>
{
    let page : any;
    let browserContext;

    function readExcel(fpath : string, sname : string)
    {
        const wb = exceldata.readFile(fpath);
        const ws : any = wb.Sheets[sname];
        const mydata = exceldata.utils.sheet_to_json(ws, {header : 1})
        return mydata;
    }
    test.beforeAll("Launching my Application", async({browser})=>   //default context and page taken
    {
        browserContext = await browser.newContext({
            recordVideo :{
               dir : "./MyTestVideo/",
               size: {width : 1280 , height : 720} 
            }
        });
        page = await browserContext.newPage();
        await page.goto("http://127.0.0.1/orangehrm-2.5.0.2/login.php")
        console.log("Successfully Launched my application")
    })

    test("Test Case to Multiple Employees", async()=>
    {
        test.setTimeout(900000);
        const jsoninfo = JSON.parse(jsondata.readFileSync('./UserJson/locatorinfo.json', 'utf-8'))
        const logininfo : any = readExcel('./UserExcel/EmpData.xlsx', 'Credentials');
        const excelempinfo : any = readExcel('./UserExcel/EmpData.xlsx', 'Userdata');
        //console.log("The Number of Records in the given Excel is : " +excelempinfo.length)

    
        await page.locator(jsoninfo.XUN).fill(logininfo[1][0])
        await page.locator(jsoninfo.XPWD).fill(logininfo[1][1])
        await page.waitForTimeout(1000);
        await page.locator(jsoninfo.XSUB).click();

        await page.waitForTimeout(1000);

        await page.screenshot({path : "./TestProofs/HomePage.jpg"})
    for(let h : number = 1 ; h <= excelempinfo.length - 1 ; h++)
    {
        await page.waitForTimeout(2000);

        await page.locator(jsoninfo.XPIM).hover();
        await page.waitForTimeout(500);
        await page.locator(jsoninfo.XADD).click();

        await page.waitForTimeout(1000);

        const F = page.frameLocator(jsoninfo.XFRAME);
      
        await F.locator(jsoninfo.XID).fill(excelempinfo[h][0].toString())  //coverts empid number to string
        await F.locator(jsoninfo.XFIRST).fill(excelempinfo[h][1])
        await F.locator(jsoninfo.XLAST).fill(excelempinfo[h][2])
        await F.locator(jsoninfo.XMID).fill(excelempinfo[h][3])
        await F.locator(jsoninfo.XNICK).fill(excelempinfo[h][4])
        await page.waitForTimeout(1000);
        await F.locator(jsoninfo.XPHOTO).setInputFiles("./EmpPhotos/" +excelempinfo[h][1]+".png")
        await page.waitForTimeout(1000);
        await page.screenshot({path : "./TestProofs/"+excelempinfo[h][1]+"_BeforeSave.jpg"})
        await F.locator(jsoninfo.XSAVE).click();
        await page.waitForTimeout(4000);
        await page.screenshot({path : "./TestProofs/"+excelempinfo[h][1]+"_AfterSave.jpg"})
        await F.locator(jsoninfo.XBACK).click();
        console.log("The Empployee with name : " +excelempinfo[h][1] +" , added successfully");
        await page.waitForTimeout(1000);
        await page.screenshot({path : "./TestProofs/"+excelempinfo[h][1]+"_AfterAdd.jpg"})
    } //for loop end

        await page.waitForTimeout(2000);

})



})
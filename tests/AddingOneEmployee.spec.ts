import{test, expect} from '@playwright/test'
import exceldata from 'xlsx'
import jsondata from 'fs'

test.describe("Test Scenario on Adding one employee", ()=>
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
        browserContext = await browser.newContext();
        page = await browserContext.newPage();
        await page.goto("http://127.0.0.1/orangehrm-2.5.0.2/login.php")
        console.log("Successfully Launched my application")
    })

    test("Test Case to add an Employee", async()=>
    {
        const jsoninfo = JSON.parse(jsondata.readFileSync('./UserJson/locatorinfo.json', 'utf-8'))
        const logininfo : any = readExcel('./UserExcel/EmpData.xlsx', 'Credentials');
        await page.locator(jsoninfo.XUN).fill(logininfo[1][0])
        await page.locator(jsoninfo.XPWD).fill(logininfo[1][1])
        await page.waitForTimeout(1000);
        await page.locator(jsoninfo.XSUB).click();

        await page.waitForTimeout(2000);

        await page.locator(jsoninfo.XPIM).hover();
        await page.waitForTimeout(500);
        await page.locator(jsoninfo.XADD).click();

        await page.waitForTimeout(1000);

        const F = page.frameLocator(jsoninfo.XFRAME);

        const excelempinfo : any = readExcel('./UserExcel/EmpData.xlsx', 'Userdata');
        await F.locator(jsoninfo.XID).fill(excelempinfo[1][0].toString())  //number to string
        await F.locator(jsoninfo.XFIRST).fill(excelempinfo[1][1])
        await F.locator(jsoninfo.XLAST).fill(excelempinfo[1][2])
        await F.locator(jsoninfo.XMID).fill(excelempinfo[1][3])
        await F.locator(jsoninfo.XNICK).fill(excelempinfo[1][4])
        await page.waitForTimeout(1000);
        await F.locator(jsoninfo.XPHOTO).setInputFiles("./EmpPhotos/Arrays.jpg")
        await page.waitForTimeout(1000);
        await F.locator(jsoninfo.XSAVE).click();
        await page.waitForTimeout(4000);
        await F.locator(jsoninfo.XBACK).click();

        await page.waitForTimeout(4000);

    })



})
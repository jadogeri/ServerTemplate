
export class EmailContext{

    constructor(){

    }

    getYear(){
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        return currentYear;
    }
    getCompany(){
        return process.env.COMPANY as string;
    }

    getLogoUrl(){
        return process.env.LOGO_URL as string;
    }
}
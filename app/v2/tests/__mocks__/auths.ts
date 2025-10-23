import { IAuth } from "../../src/interfaces/IAuth"
import { ObjectId } from 'mongodb'; // For ES Modules


const auths: IAuth[] = [
    {
        id: new ObjectId(),
        token : "karamkauamoamr405qmoa"
    },
    {
        id: new ObjectId(),
        token : "dvtastfvygubf"

    },  
    {
        id: new ObjectId(),
        token : "aefzdr452vdvsdt"

    },  
    {
        id: new ObjectId(),
        token : "ae54c5fcwerf1d"

    }

]

module.exports = auths
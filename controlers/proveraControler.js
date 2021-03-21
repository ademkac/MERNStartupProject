
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Provera = require('../models/proveraModel');


const createOdobreni = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError(
            'Nisu uneti validne vrednosti, molimo vas da ispravite gresku', 422
        ))
    }

    const {user,
        link,
        poruka,
        kompanija,
        tip,
        radnoVreme,
        lokacija,
        datum,
    } = req.body;

    const createdOdobreni= new Provera({
        user,
        link,
        poruka,
        kompanija,
        tip,
        radnoVreme,
        lokacija,
        slika: req.file.path,
        datum
        
    });

    

    try {
        
        await createdOdobreni.save();
    } catch (err) {
        const error = new HttpError(
            'Nije moguce kreirati projekat, molimo vas pokusajte opet', 500
        )
        return next(error);
    }

    res.status(201).json({odobreni: createdOdobreni});

}

const getOdobreni = async (req, res, next) => {

    let odobreni;
    try {
        odobreni = await Provera.find({});
    } catch (err) {
        const error = new HttpError(
            'Preuzimanje poslova iz baze neuspesno', 500
        )
        return next(error)
    }

    res.json({odobreni: odobreni.map(p=>p.toObject({getters: true}))})
}

const deleteOdobreni = async(req, res, next) => {
    const projectId = req.params.id;
    
    let project;
    try {
        project = await Provera.findById(projectId);

    } catch (err) {
        const error = new HttpError(
            'Nesto nije u redu, nije moguce izbrisati projekat', 500
        )
        return next(error)
    }

    if(!project){
        const error = new HttpError(
            'Nije moguce pronaci projekat sa datim id.', 404
        )
        return next(error);
    }

    const imagePath = project.slika;

    try {
        await project.remove();
    } catch (err) {
        const error = new HttpError(
            'Nesto nije u redu, nije moguce izbrisati posao', 500
        )
        return next(error)
    }

    /* fs.unlink(imagePath, err => {
        console.log(err)
    }); */
    
    res.status(200).json({message: 'Deleted project. '});
}

exports.createOdobreni = createOdobreni;
exports.getOdobreni = getOdobreni;
exports.deleteOdobreni = deleteOdobreni
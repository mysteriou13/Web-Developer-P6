const { callbackify } = require('util');

module.exports = {


  affiche_sauce: async function findOne(r) {
    
    const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("p6_oc");

        let collection = db.collection('sauces');

        let query = { name: 'Volkswagen' }

        let res = await collection.find().toArray();

        console.log(res.status(200).json());

    } catch (err) {

        console.log(err);
    } finally {

        client.close();
    }
}



}
import mongoose from 'mongoose';

const DB_URL = "database link";

const DB_URL_local = "local database link";

const connect_DB = async () => {
    try {
        const conne = await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to database ==> 100%');
    } catch (error) {
        console.log(error);
        console.log('Cannot connect to database');

    }

}

export default connect_DB;

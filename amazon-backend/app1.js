const express = require('express');
const bodyParser = require('body-parser');
const { Translator } = require('googletrans');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const translator = new Translator();
app.use(cors());
app.use(bodyParser.json());

const mongoURL = 'mongodb://localhost:27017/';
const dbName = 'your-database-name';
const collectionName = 'products';

const client = new MongoClient(mongoURL, { useUnifiedTopology: true });

client.connect((err) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }

    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const productsCollection = db.collection(collectionName);

    app.post('/voice_translation', async (req, res) => {
        try {
            const indicSpeechInput = req.body.indic_speech_input;

            // Translate Indic language input to English
            const englishTranslation = await translateToEnglish(indicSpeechInput);

            // Simulated backend processing with the translated text
            const backendProcessingResult = processBackend(englishTranslation);

            // Search for matched products in the database
            const matchedProducts = await searchProducts(englishTranslation, productsCollection);

            // Display the result in the user's preferred Indic language
            const indicOutput = await translateToIndic(backendProcessingResult, 'en');

            console.log("Input (Indic):", indicSpeechInput);
            console.log("Translated to English:", englishTranslation);
            console.log("Backend Processing Result:", backendProcessingResult);
            console.log("Output (Indic):", indicOutput);
            console.log("Matched Products:", matchedProducts);

            res.json({
                indic_speech_input: indicSpeechInput,
                english_translation: englishTranslation,
                backend_processing_result: backendProcessingResult,
                indic_output: indicOutput,
                matched_products: matchedProducts,
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    process.on('SIGINT', () => {
        client.close();
        process.exit();
    });
});

async function translateToEnglish(text, targetLanguage = 'en') {
    const translation = await translator.translate(text, targetLanguage);
    return translation.text;
}

function processBackend(text) {
    return `Processed: ${text}`;
}

async function translateToIndic(text, sourceLanguage = 'en') {
    const translation = await translator.translate(text, sourceLanguage);
    return translation.text;
}

async function searchProducts(query, collection) {
    const result = await collection.find({ name: { $regex: `.*${query}.*`, $options: 'i' } }).toArray();
    return result;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

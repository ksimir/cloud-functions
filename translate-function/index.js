/**
 * Cloud Functions Sample to call Cloud Transaltion API
 * Responds to any HTTP request that can provide a "message" and "language" field in the body.
 * Only translate to french.
 * Author: Samir Hammoudi
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
 
// Replace the <key> here with you service account API key generated in GCP console 
var gcloud = require('google-cloud')({
  projectId: process.env.GCP_PROJECT,
  key: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
});

var translate = gcloud.translate();

exports.translatetext = function translatetext(req, res) {
	// Example input: {"message": "Hello!","language": "french"}
	if (req.body.result.parameters.message === undefined) {
		// This is an error case, as "message" is required.
		console.log("No message to translate");
		res.status(400).send('No message defined!');
	} else {
		// verify that the target language is french
		if (req.body.result.parameters.language == 'french' || req.body.result.parameters.language == 'French'){
			console.log("French");
			// Excute the translation to french
			translate.translate(req.body.result.parameters.message, 'fr', function(err, translation) {
				if (!err) {
					console.log(translation);
					// return a JSON response containing the translation
					res.json({ "speech": translation, "displayText": translation, "source": "cloud-function-translate" });
				}
			});
		} else {
			console.log("Not supported language");
			// return a JSON response with the original message since the language is not supported
			res.json({ "speech": req.body.result.parameters.message, "displayText": req.body.result.parameters.message, "source": "cloud-function-translate" });
		}
	}
};

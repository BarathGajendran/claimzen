const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Claims AI Damage Analyzer Service
 * 
 * In a production environment, this service would be integrated with the Gemini Developer API
 * (e.g. using the `@google/genai` SDK and a multimodal model like `gemini-2.5-flash`)
 * to analyze the uploaded vehicle image.
 * 
 * For the hackathon demonstration, this utilizes a file content hash algorithm.
 * Different images will consistently analyze into different categories of vehicle damage.
 */

/**
 * Analyzes vehicle damage based on the uploaded image content hash.
 * 
 * @param {string} imageUrl - The URL or local path of the uploaded image
 * @param {string} description - User's description of the damage or filename
 * @returns {Promise<object>} Damage assessment report matching the Claim Schema
 */
const analyzeDamage = async (imageUrl, description) => {
  // Simulate network latency for AI processing
  await new Promise(resolve => setTimeout(resolve, 1500));

  const descLower = (description || '').toLowerCase();

  // 1. Check for manual keyword overrides (enables explicit demo control via filename)
  let activeCase = -1;
  if (descLower.includes('front') || descLower.includes('bumper') || descLower.includes('dent') || descLower.includes('fr') || descLower.includes('front_bumper_dent')) {
    activeCase = 0;
  } else if (descLower.includes('scratch') || descLower.includes('side') || descLower.includes('door') || descLower.includes('side_door_scratch')) {
    activeCase = 1;
  } else if (descLower.includes('windshield') || descLower.includes('glass') || descLower.includes('broken_windshield')) {
    activeCase = 2;
  } else if (descLower.includes('rear') && descLower.includes('bumper') || descLower.includes('collision') || descLower.includes('rear_bumper_collision')) {
    activeCase = 3;
  } else if (descLower.includes('headlight') || descLower.includes('lamp') || descLower.includes('light') || descLower.includes('broken_headlight')) {
    activeCase = 4;
  }

  // 2. If no keywords found, compute MD5 hash of image file to dynamically decide category
  if (activeCase === -1) {
    try {
      // Resolve path of uploaded file
      const relativePath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
      const fullPath = path.resolve(__dirname, '../', relativePath);
      
      if (fs.existsSync(fullPath)) {
        const fileBuffer = fs.readFileSync(fullPath);
        const md5Hash = crypto.createHash('md5').update(fileBuffer).digest('hex');
        
        // Sum up characters in md5 hash to generate a stable, content-driven integer index
        let sum = 0;
        for (let i = 0; i < md5Hash.length; i++) {
          sum += md5Hash.charCodeAt(i);
        }
        activeCase = sum % 5; // Modulo to distribute across the 5 test categories
      }
    } catch (err) {
      console.error('Failed to hash image content. Falling back to random.', err);
    }
  }

  // Fallback to random if hashing fails
  if (activeCase === -1) {
    activeCase = Math.floor(Math.random() * 5);
  }

  // Define details for the 5 targeted test cases
  let damageType = 'Front Bumper Dent';
  let severity = 'Medium';
  let repairCost = 22000;
  let recommendation = 'Repair front bumper cover cover. Perform support brackets inspection and clearcoat matching.';
  let confidence = 94;
  let fraudRisk = 'Low';

  switch (activeCase) {
    case 0:
      damageType = 'Front Bumper Dent';
      severity = 'Medium';
      repairCost = 15000 + Math.floor(Math.random() * 15000); // ₹15,000–₹30,000
      confidence = 94;
      recommendation = 'Repair front bumper cover cover. Inspect structural support brackets and perform clearcoat color match.';
      break;
    case 1:
      damageType = 'Side Door Scratch';
      severity = 'Low';
      repairCost = 2000 + Math.floor(Math.random() * 6000); // ₹2,000–₹8,000
      confidence = 97;
      recommendation = 'Conduct Clearcoat compound polishing and localized paint chip clearcoat re-application.';
      break;
    case 2:
      damageType = 'Broken Windshield';
      severity = 'High';
      repairCost = 8000 + Math.floor(Math.random() * 12000); // ₹8,000–₹20,000
      confidence = 96;
      recommendation = 'Perform full windshield safety glass panel replacement. Mandatory forward-facing ADAS sensor recalibration.';
      break;
    case 3:
      damageType = 'Rear Bumper Collision';
      severity = 'Medium';
      repairCost = 12000 + Math.floor(Math.random() * 13000); // ₹12,000–₹25,000
      confidence = 91;
      recommendation = 'Remove and replace rear bumper cover assembly. Verify backing parking proximity sensors wiring alignment.';
      break;
    case 4:
      damageType = 'Broken Headlight';
      severity = 'Medium';
      repairCost = 4000 + Math.floor(Math.random() * 8000); // ₹4,000–₹12,000
      confidence = 89;
      recommendation = 'Replace cracked composite headlight housing unit. Conduct beam direction recalibration.';
      break;
  }

  // High-fidelity fraud edge checking rules
  if (descLower.includes('rust') || descLower.includes('metal') || descLower.includes('corrosion')) {
    fraudRisk = 'Medium';
  }

  return {
    damageType,
    severity,
    repairCost,
    confidence,
    fraudRisk,
    recommendation
  };
};

module.exports = {
  analyzeDamage
};

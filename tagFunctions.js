/**
 * Extract tag value
 * @param {Object} tagConfig Tag configuration for a single tag
 * @param {String} message Message received from router
 */
function extractValue(tagConfig, message) {
    let result = message;
    let match;
    let exActions = Object.values(tagConfig.extractAction).filter(v => typeof(v) == 'object');
    for (let i = 0; i < exActions.length; i++) {
        
        let action = exActions[i];

        if (action.type == 'include') {
            //console.log(result);
            match = result.match((new RegExp(action.regEx.expression, action.regEx.flags)));
        }
        else if (action.type == 'exclude') {
            match = result.replace((new RegExp(action.regEx.expression, action.regEx.flags)), '');
        }

        if (!match) {
            // Break the loop if match is invalid
            break;
        } else if (Array.isArray(match) && match.length > 0) {
            // If match returned an array, take the first entry
            result = match[0]
        } else {
            result = match;
        }
    }

    // Parse value
    let value = parseFloat(match);
    if (value >= 0) {
        // run modifiers
        let modActions = Object.values(tagConfig.modifyAction).filter(v => typeof(v) == 'object');
        modActions.forEach(modify => {
            if (message.match(new RegExp(modify.regEx.expression, modify.regEx.flags))) {
                value = value * modify.multiplier;
            }
        });

        return value;
    }
    else {
        return undefined;
    }

}

module.exports = { extractValue };

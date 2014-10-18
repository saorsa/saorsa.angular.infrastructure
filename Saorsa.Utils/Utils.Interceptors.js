/** @namespace */
Saorsa.Utils = {};
/**
 * Contains the current DOM element that will have messages prepended.
 */
Saorsa.Utils.CurrentMessageContainer = null;
/**
* Shows a loading screen
* 
*/
Saorsa.Utils.showLoading = function () {
    $("#Wait").show();
};
/**
 * Hides an active (or not) loading screen
 */
Saorsa.Utils.hideLoading = function () {
    $("#Wait").hide();
};

/**
 * Converts the values of fields for an object to a date object
 * 
 * @param {object} object a JSON object with fields
 * @param {array} fields an array of field names for the object
 */
Saorsa.Utils.fieldsToDate = function(object, fields) {
    for (var i = 0; i < fields.length; i++) {
        if (object[fields[i]]) {
            object[fields[i]] = new Date(object[fields[i]]);
        }
    }
}
/**
 * Converts the values of fields for an object to a date object
 * 
 * @param {object} object a JSON object with fields
 * @param {array} fields an array of field names for the object
 */
Saorsa.Utils.toDate = function(object, fields) {
    if (Object.prototype.toString.call(object) === '[object Array]') {
        for (var i = 0; i < object.length; i++) {
            Saorsa.Utils.fieldsToDate(object[i], fields);
        }
    } else {
        Saorsa.Utils.fieldsToDate(object, fields);
    }
}
/**
 * Visually shows messages from a success/failure/other JSON response object
 * 
 * @param {BaseResponseViewMOodel} response a JSON object with fields
 */
Saorsa.Utils.showMessages = function (response, containerElement) {
    if (response.success === false) {
        Saorsa.Utils.showErrors(response.messages, containerElement);
    } else if (response.success === true) {
        Saorsa.Utils.showOkMessages(response.messages, containerElement);
    } else {
        Saorsa.Utils.showOkMessages(response, containerElement);
    }
}
/**
 * Visually shows an(or multiple) error message from a JSON response object
 * 
 * @param {BaseResponseViewModel} messages a JSON object. If the messages are stored in an array, they should be in a ["$values"] field (.NET reference preserving)
 */
Saorsa.Utils.showErrors = function (messages, containerElement) {
    Saorsa.Utils.clearAllMessages(containerElement);
    var container = Saorsa.Utils.CreateErrorContainer(containerElement);
    if (messages && Object.prototype.toString.call(messages["$values"]) === '[object Array]') {
        for (var i = 0; i < messages["$values"].length; i++) {
            container.append('<p class="text-warning">' + messages["$values"][i] + '</p>');
        }
    } else {
        container.append('<p class="text-warning">' + messages + '</p>');
    }
}
/**
 * Visually shows an(or multiple) success message from a JSON response object
 * 
 * @param {BaseResponseViewModel} messages a JSON object. If the messages are stored in an array, they should be in a ["$values"] field (.NET reference preserving)
 */
Saorsa.Utils.showOkMessages = function (messages, containerElement) {
    Saorsa.Utils.clearAllMessages(containerElement);
    var container = Saorsa.Utils.CreateMessageContainer(containerElement);
    if (messages && Object.prototype.toString.call(messages["$values"]) === '[object Array]') {
        for (var i = 0; i < messages["$values"].length; i++) {
            container.append('<p class="text-info">' + messages["$values"][i] + '</p>');
        }
    } else {
        container.append('<p class="text-info">' + messages + '</p>');
    }
}
/**
* Clears all messages displayed on a page
*/
Saorsa.Utils.clearAllMessages = function (containerElement) {
    if (!containerElement)
        containerElement = "";
    $(containerElement + " .saorsa-message").remove();
}
/**
* Creates an error placeholder
*/
Saorsa.Utils.CreateErrorContainer = function (element) {
    if (!element)
        element = ".body-content";
    var container = $('<div class="saorsa-message bg-danger"></div>');
    $(element).prepend(container);
    return container;
}
/**
* Creates a message container
*/
Saorsa.Utils.CreateMessageContainer = function (element) {
    if (!element)
        element = ".body-content";
    var container = $('<div class="saorsa-message bg-info"></div>');
    $(element).prepend(container);
    return container;
}
/**
 * Converts a string to a date object and aligns it to the current time zone
 * 
 * @param datestring a string with date.
 */
Saorsa.Utils.ToLocalDateString = function(dateString) {
    var date = new Date(dateString);
    return new Date(date.getTime() + (date.getTimezoneOffset() * -60000));
};
/**
 * Converts a string to a date object and aligns it to central time
 * 
 * @param datestring a string with date.
 */
Saorsa.Utils.ToUTCDateString = function (dateString) {
    var date = new Date(dateString);
    return new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
};
/**
 * Creates a .NET preserve reference JSON object list (hashtable) of objects distinguished by their $id property
 * 
 * @param data A .NET preserve reference JSON.
 */
Saorsa.Utils.GetReferencesMap = function (data) {
    var result = new Object();
    function recurse(cur, prop) {
        if (cur && cur["$id"]) {
			var id = cur["$id"];
            if (Saorsa.Utils.IsDebug)
                console.log("Adding " + prop +"(id: "+ id  + ") to flat reference list ");
            result[id] = cur;
        }
        if (Array.isArray(cur)) {
            for (var i = 0, l = cur.length; i < l; i++) {
                recurse(cur[i], prop ? prop + "." + i : "" + i);
            }
        } else {
            if (cur != null && typeof(cur) !== 'string') {
                for (var p in cur) {
                        recurse(cur[p], prop ? prop + "." + p : p);
                }
            }
        }
    }
    recurse(data, "");
    return result;
}
/**
 * Replaces $ref fields with their corresponding object references in a cetain depth of an object.
 * 
 * @param data A .NET preserve reference JSON.
 * @param referenceMap A flat list of all objects with their $id's
 * @param maxDepth The maximum depth of levels, the object will be searched in
 */
Saorsa.Utils.ReplaceReferences = function (data, referenceMap, maxDepth) {
    function recurse(cur, prop, references, currentDepth, max) {
        if (currentDepth >= max) {
            if(Saorsa.Utils.IsDebug)
                console.log("Maximum reference replacement depth reached");
        } else {
            if (Saorsa.Utils.IsDebug)
                console.log("Searching " + prop);
            currentDepth++;
            if (Array.isArray(cur)) {
                //Search for referrences in the arrays
                for (var i = 0, l = cur.length; i < l; i++) {
                    if (cur[i] && cur[i]["$ref"]) {
                        if (Saorsa.Utils.IsDebug)
                            console.log("Replacing in array: " + (prop ? prop + "." + i : "" + i));
                        cur[i] = references[cur[i]["$ref"]];
                    }
                    recurse(cur[i], prop ? prop + "." + i : "" + i, references, currentDepth, max);
                }
            } else {
                //search for referrences in child objects
                if (cur != null && typeof (cur) !== 'string') {
                    for (var p in cur) {
                        if (cur[p] && cur[p]["$ref"]) {
                            if (Saorsa.Utils.IsDebug)
                                console.log("Replacing in object" + (prop ? prop + "." + p : "" + p));
                            cur[p] = references[cur[p]["$ref"]];
                        }
                        recurse(cur[p], prop ? prop + "." + p : p, references, currentDepth, max);
                    }
                }
            }
        }
    }
    recurse(data, "", referenceMap, 0, maxDepth);
}
/**
 * Replaces $ref fields with their corresponding object references in a cetain depth of an object.
 * 
 * @param data A .NET preserve reference JSON.
 * @returns  A .NET preserve reference JSON with reference values filled to a certain depth.
 */
Saorsa.Utils.TransformReferencePreservedJson = function (data) {
    if (Saorsa.Utils.IsDebug)
        console.log("Getting flat refrence map");
    var referencesMap = Saorsa.Utils.GetReferencesMap(data);
    if (Saorsa.Utils.IsDebug)
        console.log("Replacing references 3 levels deep (object.values.sessions)");
    Saorsa.Utils.ReplaceReferences(data, referencesMap, 3);
    return data;
}
/**
 * Searches for a reference id in a .NET preserve reference JSON document
 * 
 * @param document A .NET preserve reference JSON.
 * @param id The reference id to search for
 * @returns The object value.
 */
Saorsa.Utils.TraverseDocument = function (document, id) {
    var k;
    if (document instanceof Object) {
        for (k in document) {
            if (document.hasOwnProperty(k)) {
                if (k == "$id" && document[k] == id) {
                    return document;
                } else {
                    var returnObject = Saorsa.Utils.TraverseDocument(document[k], id);
                    if (returnObject) {
                        return returnObject;
                    }
                }
            }
        }
    } else {
        //Ignore
    };
}
/**
 * Adds a "startsWith" optionto string
 */
if (typeof String.prototype.startsWith != 'function') {  
    String.prototype.startsWith = function (str) {
        return this.indexOf(str) == 0;
    };
}

export const removeIdDuplicate = (id) => id + String(Math.random());

//https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
export const stripHtml = text => text.replace(/(<([^>]+)>)/gi, "");
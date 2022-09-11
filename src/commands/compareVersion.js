

export default function (version1, version2) {
    //converting into array by splitting at .
 
    version1 = version1.split('.');
    version2 = version2.split('.');
    // Finding the max length of either array
    let length = Math.max(version1.length, version2.length);
 
    // Iterate over the length
    for (let i = 0; i < length; i++) {
      
        if ((+version1[i] || 0) < (+version2[i] || 0)) return false;
        if ((+version1[i] || 0) > (+version2[i] || 0)) return true;
    }
    return true;
 }
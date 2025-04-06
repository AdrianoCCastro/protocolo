   import * as ImagePicker from "expo-image-picker";

   export async function pickImage() {
     let result = await ImagePicker.launchCameraAsync({
       allowsEditing: true,
       aspect: [4, 3],
       quality: 1,
     });
   
     if (!result.canceled && result.assets && result.assets.length > 0) {
       return result.assets[0].uri;
     }
   
     return null;
   }
export const formatTime = (element) => {

     let numeroHora = '';
            if(element.toString().length > 2){
                numeroHora = element.toString().split('.')[0];
                return `${numeroHora}:30`;
            }else {
                return `${element}:00`;
            }

}
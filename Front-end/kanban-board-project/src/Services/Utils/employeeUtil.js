
function formatEmployeeData(empObj) 
{
     return Object.entries(empObj).map(([id, nameEmail]) => {
       // split on the last dash in the string as sometime names name can be Chris Evans - chri@gmail.com
       const lastDashIndex = nameEmail.lastIndexOf("-");
       const name = nameEmail.slice(0, lastDashIndex).trim();
       const email = nameEmail.slice(lastDashIndex + 1).trim();
       return { id, name, email };
     });
}

export default formatEmployeeData;

/*
convert object into array


1.Object.entries -- each entry is key-value pair -- like map
                 -- return id : id and nameEmail : {name - email}

2. extract name and email indidviual from nameEmail

3. and return like [
               { id: "101", name: "John Doe", email: "john@example.com" },
               { id: "102", name: "Jane Smith", email: "jane@example.com" }
                ]


*/         
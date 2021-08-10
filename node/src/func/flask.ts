export function ShowRPInspect(id: string[], postres: any){
    postres.send(
        fetch("http://localhost:3001/recc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Test",
            body: "I am testing!",
            userId: 1,
          }),
        })
        .then((data)=>{
          if(data.error) {
            console.log(data.error);
          }
          else{
            console.log(data.title);
          }
        })
        );
}

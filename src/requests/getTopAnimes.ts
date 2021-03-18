export default `
{
  Page(perPage:50){
    media (sort:POPULARITY_DESC, popularity_greater: 4000){      
      title {
        romaji
      }
      characters(sort:FAVOURITES_DESC, perPage: 1){
        nodes{
          name {
            full
          }
          image{
            medium
          }
        }
      }
  	}	
  }
}
`;
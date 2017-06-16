
## Endpoints

* `GET /api/v1/articles` returns a all of the articles available.
* `POST /api/v1/articles` creates a new article.
* `PATCH /api/v1/articles/:id` updates the content of the article.

## Debugging Practice Scenarios

**Practice Scenario 1 - Highlighting Articles by Tag**

When we click on a colored tag, any articles with that tag should be highlighted with the corresponding color. Some articles will have more than one tag. e.g. 'hockey' and 'playoffs'. The article should be highlighted with the color of the most recently clicked tag.

------------------------------------------

**Practice Scenario 2 - Updating the Byline**  

The bylines for each article are contenteditable fields. When you click on the byline, you should be able to edit it and have your changes persist upon hitting the 'enter' key.

------------------------------------------

**Practice Scenario 3 - Persisting Articles in IndexedDB**  

When we click 'Save for offline reading', the article should be saved to IndexedDB. When we refresh the page, any articles that are in IndexedDB should have the star icon indicator denoting that it is available offline.
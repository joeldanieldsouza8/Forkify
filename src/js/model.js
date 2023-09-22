
export const state = {
    recipes: {},
}

// This is an async function because it will fetch data from the Forkify API
export async function loadRecipe(id) {
    try {
        const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`)
        const data = await res.json()

        if (!res.ok) throw new Error(`${data.message} (${res.status})`)

        let { recipe } = data.data

        recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
        }

        state.recipes[id] = recipe
    } catch (err) {
        console.error(`${err} 💥💥💥`)
        throw err;
    }
}
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.menuItemIngredient.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.category.deleteMany()
  await prisma.ingredient.deleteMany()

  // Create pizza ingredients
  const ingredients = await Promise.all([
    // Pizza base ingredients
    prisma.ingredient.create({
      data: {
        name: 'Pizza Dough',
        nameTr: 'Pizza Hamuru',
        allergen: true // Contains gluten
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Tomato Sauce',
        nameTr: 'Domates Sosu',
        allergen: false
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Mozzarella Cheese',
        nameTr: 'Mozzarella Peyniri',
        allergen: true // Contains dairy
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Olive Oil',
        nameTr: 'Zeytinyağı',
        allergen: false
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Fresh Basil',
        nameTr: 'Taze Fesleğen',
        allergen: false
      }
    }),

    // Meat toppings
    prisma.ingredient.create({
      data: {
        name: 'Pepperoni',
        nameTr: 'Pepperoni',
        allergen: false
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Salami',
        nameTr: 'Salam',
        allergen: false
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Italian Sausage',
        nameTr: 'İtalyan Sosisi',
        allergen: false
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Ground Beef',
        nameTr: 'Kıyma',
        allergen: false
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Prosciutto',
        nameTr: 'Prosciutto',
        allergen: false
      }
    }),

    // Vegetable toppings
    prisma.ingredient.create({
      data: {
        name: 'Mushrooms',
        nameTr: 'Mantar',
        allergen: false
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Bell Peppers',
        nameTr: 'Dolma Biber',
        allergen: false
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Red Onion',
        nameTr: 'Kırmızı Soğan',
        allergen: false
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Black Olives',
        nameTr: 'Siyah Zeytin',
        allergen: false
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Arugula',
        nameTr: 'Roka',
        allergen: false
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Sun-dried Tomatoes',
        nameTr: 'Kurutulmuş Domates',
        allergen: false
      }
    }),

    // Cheese varieties
    prisma.ingredient.create({
      data: {
        name: 'Parmesan Cheese',
        nameTr: 'Parmesan Peyniri',
        allergen: true // Contains dairy
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Gorgonzola Cheese',
        nameTr: 'Gorgonzola Peyniri',
        allergen: true // Contains dairy
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Ricotta Cheese',
        nameTr: 'Ricotta Peyniri',
        allergen: true // Contains dairy
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Goat Cheese',
        nameTr: 'Keçi Peyniri',
        allergen: true // Contains dairy
      }
    })
  ])

  // Create pizza categories
  const classicPizzas = await prisma.category.create({
    data: {
      name: 'Classic Pizzas',
      nameTr: 'Klasik Pizzalar',
      description: 'Traditional Italian pizza recipes',
      descriptionTr: 'Geleneksel İtalyan pizza tarifleri',
      order: 1
    }
  })

  const gourmetPizzas = await prisma.category.create({
    data: {
      name: 'Gourmet Pizzas',
      nameTr: 'Gurme Pizzalar',
      description: 'Premium pizzas with special ingredients',
      descriptionTr: 'Özel malzemelerle hazırlanan premium pizzalar',
      order: 2
    }
  })

  const vegetarianPizzas = await prisma.category.create({
    data: {
      name: 'Vegetarian Pizzas',
      nameTr: 'Vejetaryen Pizzalar',
      description: 'Delicious meat-free options',
      descriptionTr: 'Lezzetli etsiz seçenekler',
      order: 3
    }
  })

  const appetizers = await prisma.category.create({
    data: {
      name: 'Appetizers',
      nameTr: 'Başlangıçlar',
      description: 'Perfect starters for your meal',
      descriptionTr: 'Yemeğiniz için mükemmel başlangıçlar',
      order: 4
    }
  })

  const desserts = await prisma.category.create({
    data: {
      name: 'Desserts',
      nameTr: 'Tatlılar',
      description: 'Sweet endings to your meal',
      descriptionTr: 'Yemeğinizin tatlı finali',
      order: 5
    }
  })

  // Create classic pizzas
  const margherita = await prisma.menuItem.create({
    data: {
      name: 'Margherita',
      nameTr: 'Margherita',
      description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
      descriptionTr: 'Domates sosu, mozzarella ve taze fesleğen ile klasik pizza',
      price: 85.00,
      categoryId: classicPizzas.id,
      isVegetarian: true,
      isVegan: false,
      order: 1
    }
  })

  const pepperoni = await prisma.menuItem.create({
    data: {
      name: 'Pepperoni',
      nameTr: 'Pepperoni',
      description: 'Classic pepperoni pizza with mozzarella cheese',
      descriptionTr: 'Mozzarella peyniri ile klasik pepperoni pizza',
      price: 95.00,
      categoryId: classicPizzas.id,
      isVegetarian: false,
      isVegan: false,
      order: 2
    }
  })

  const quattroStagioni = await prisma.menuItem.create({
    data: {
      name: 'Quattro Stagioni',
      nameTr: 'Dört Mevsim',
      description: 'Four seasons pizza with mushrooms, pepperoni, peppers and olives',
      descriptionTr: 'Mantar, pepperoni, biber ve zeytinli dört mevsim pizza',
      price: 105.00,
      categoryId: classicPizzas.id,
      isVegetarian: false,
      isVegan: false,
      order: 3
    }
  })

  // Create gourmet pizzas
  const prosciuttoArugula = await prisma.menuItem.create({
    data: {
      name: 'Prosciutto Arugula',
      nameTr: 'Prosciutto Roka',
      description: 'Prosciutto, arugula, parmesan and olive oil',
      descriptionTr: 'Prosciutto, roka, parmesan ve zeytinyağı',
      price: 125.00,
      categoryId: gourmetPizzas.id,
      isVegetarian: false,
      isVegan: false,
      order: 1
    }
  })

  const gorgonzolaPizza = await prisma.menuItem.create({
    data: {
      name: 'Gorgonzola & Walnut',
      nameTr: 'Gorgonzola Ceviz',
      description: 'Gorgonzola cheese, walnuts and arugula',
      descriptionTr: 'Gorgonzola peyniri, ceviz ve roka',
      price: 115.00,
      categoryId: gourmetPizzas.id,
      isVegetarian: true,
      isVegan: false,
      order: 2
    }
  })

  // Create vegetarian pizzas
  const veggiePizza = await prisma.menuItem.create({
    data: {
      name: 'Vegetable Supreme',
      nameTr: 'Sebze Supreme',
      description: 'Mushrooms, bell peppers, onions, olives and fresh herbs',
      descriptionTr: 'Mantar, dolma biber, soğan, zeytin ve taze otlar',
      price: 90.00,
      categoryId: vegetarianPizzas.id,
      isVegetarian: true,
      isVegan: false,
      order: 1
    }
  })

  const caprese = await prisma.menuItem.create({
    data: {
      name: 'Caprese',
      nameTr: 'Caprese',
      description: 'Fresh tomatoes, mozzarella and basil',
      descriptionTr: 'Taze domates, mozzarella ve fesleğen',
      price: 88.00,
      categoryId: vegetarianPizzas.id,
      isVegetarian: true,
      isVegan: false,
      order: 2
    }
  })

  // Create appetizers
  const garlicBread = await prisma.menuItem.create({
    data: {
      name: 'Garlic Bread',
      nameTr: 'Sarımsaklı Ekmek',
      description: 'Fresh baked bread with garlic butter and herbs',
      descriptionTr: 'Sarımsaklı tereyağı ve otlarla fırınlanmış taze ekmek',
      price: 35.00,
      categoryId: appetizers.id,
      isVegetarian: true,
      isVegan: false,
      order: 1
    }
  })

  // Create desserts
  const tiramisu = await prisma.menuItem.create({
    data: {
      name: 'Tiramisu',
      nameTr: 'Tiramisu',
      description: 'Classic Italian dessert with coffee and mascarpone',
      descriptionTr: 'Kahve ve mascarpone ile klasik İtalyan tatlısı',
      price: 65.00,
      categoryId: desserts.id,
      isVegetarian: true,
      isVegan: false,
      order: 1
    }
  })

  // Add ingredients to pizzas
  const doughId = ingredients.find(i => i.nameTr === 'Pizza Hamuru')!.id
  const sauceId = ingredients.find(i => i.nameTr === 'Domates Sosu')!.id
  const mozzarellaId = ingredients.find(i => i.nameTr === 'Mozzarella Peyniri')!.id
  const basilId = ingredients.find(i => i.nameTr === 'Taze Fesleğen')!.id
  const pepperoniId = ingredients.find(i => i.nameTr === 'Pepperoni')!.id
  const mushroomsId = ingredients.find(i => i.nameTr === 'Mantar')!.id
  const peppersId = ingredients.find(i => i.nameTr === 'Dolma Biber')!.id
  const olivesId = ingredients.find(i => i.nameTr === 'Siyah Zeytin')!.id
  const prosciuttoId = ingredients.find(i => i.nameTr === 'Prosciutto')!.id
  const arugulaId = ingredients.find(i => i.nameTr === 'Roka')!.id
  const parmesanId = ingredients.find(i => i.nameTr === 'Parmesan Peyniri')!.id
  const gorgonzolaId = ingredients.find(i => i.nameTr === 'Gorgonzola Peyniri')!.id
  const onionId = ingredients.find(i => i.nameTr === 'Kırmızı Soğan')!.id

  await prisma.menuItemIngredient.createMany({
    data: [
      // Margherita ingredients
      { menuItemId: margherita.id, ingredientId: doughId },
      { menuItemId: margherita.id, ingredientId: sauceId },
      { menuItemId: margherita.id, ingredientId: mozzarellaId },
      { menuItemId: margherita.id, ingredientId: basilId },
      
      // Pepperoni ingredients
      { menuItemId: pepperoni.id, ingredientId: doughId },
      { menuItemId: pepperoni.id, ingredientId: sauceId },
      { menuItemId: pepperoni.id, ingredientId: mozzarellaId },
      { menuItemId: pepperoni.id, ingredientId: pepperoniId },
      
      // Quattro Stagioni ingredients
      { menuItemId: quattroStagioni.id, ingredientId: doughId },
      { menuItemId: quattroStagioni.id, ingredientId: sauceId },
      { menuItemId: quattroStagioni.id, ingredientId: mozzarellaId },
      { menuItemId: quattroStagioni.id, ingredientId: mushroomsId },
      { menuItemId: quattroStagioni.id, ingredientId: pepperoniId },
      { menuItemId: quattroStagioni.id, ingredientId: peppersId },
      { menuItemId: quattroStagioni.id, ingredientId: olivesId },
      
      // Prosciutto Arugula ingredients
      { menuItemId: prosciuttoArugula.id, ingredientId: doughId },
      { menuItemId: prosciuttoArugula.id, ingredientId: mozzarellaId },
      { menuItemId: prosciuttoArugula.id, ingredientId: prosciuttoId },
      { menuItemId: prosciuttoArugula.id, ingredientId: arugulaId },
      { menuItemId: prosciuttoArugula.id, ingredientId: parmesanId },
      
      // Gorgonzola Pizza ingredients
      { menuItemId: gorgonzolaPizza.id, ingredientId: doughId },
      { menuItemId: gorgonzolaPizza.id, ingredientId: mozzarellaId },
      { menuItemId: gorgonzolaPizza.id, ingredientId: gorgonzolaId },
      { menuItemId: gorgonzolaPizza.id, ingredientId: arugulaId },
      
      // Veggie Pizza ingredients
      { menuItemId: veggiePizza.id, ingredientId: doughId },
      { menuItemId: veggiePizza.id, ingredientId: sauceId },
      { menuItemId: veggiePizza.id, ingredientId: mozzarellaId },
      { menuItemId: veggiePizza.id, ingredientId: mushroomsId },
      { menuItemId: veggiePizza.id, ingredientId: peppersId },
      { menuItemId: veggiePizza.id, ingredientId: onionId },
      { menuItemId: veggiePizza.id, ingredientId: olivesId },
      
      // Caprese ingredients
      { menuItemId: caprese.id, ingredientId: doughId },
      { menuItemId: caprese.id, ingredientId: mozzarellaId },
      { menuItemId: caprese.id, ingredientId: basilId }
    ]
  })

  console.log('Pizza database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

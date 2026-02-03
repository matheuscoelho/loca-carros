import { Migration } from './index'

const OLD_TO_NEW_IMAGE_MAP: Record<string, string> = {
  '/assets/imgs/page/homepage1/car-1.png': '/assets/imgs/cars-listing/cars-listing-1/car-1.png',
  '/assets/imgs/page/homepage1/car-2.png': '/assets/imgs/cars-listing/cars-listing-1/car-2.png',
  '/assets/imgs/page/homepage1/car-3.png': '/assets/imgs/cars-listing/cars-listing-1/car-3.png',
  '/assets/imgs/page/homepage1/sedan.png': '/assets/imgs/cars-listing/cars-listing-1/car-3.png',
  '/assets/imgs/page/homepage1/suv.png': '/assets/imgs/cars-listing/cars-listing-1/car-4.png',
  '/assets/imgs/page/homepage1/hatchback.png': '/assets/imgs/cars-listing/cars-listing-1/car-5.png',
  '/assets/imgs/page/homepage1/electric.png': '/assets/imgs/cars-listing/cars-listing-1/car-6.png',
}

export const migration_003_fix_car_images: Migration = {
  name: '003_fix_car_images',
  up: async (db) => {
    const carsCollection = db.collection('cars')

    for (const [oldPath, newPath] of Object.entries(OLD_TO_NEW_IMAGE_MAP)) {
      const result = await carsCollection.updateMany(
        { 'images.url': oldPath },
        { $set: { 'images.$[elem].url': newPath } },
        { arrayFilters: [{ 'elem.url': oldPath }] }
      )
      if (result.modifiedCount > 0) {
        console.log(`  Atualizadas ${result.modifiedCount} imagens: ${oldPath} → ${newPath}`)
      }
    }

    console.log('  Imagens dos carros corrigidas.')
  },
}

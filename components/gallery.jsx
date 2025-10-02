export default function GallerySection() {
  const images = [
    {
      id: 1,
      src: "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/HomePage/adoptedPet.jpg",
      title: "Adopted Puppy",
    },
    {
      id: 2,
      src: "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/HomePage/happyCat01.jpg",
      title: "Happy Cat",
    },
    {
      id: 3,
      src: "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/HomePage/vet%20team.jpg",
      title: "Vet Team",
    },
    {
      id: 4,
      src: "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/HomePage/petEvent.jpg",
      title: "Pet Event",
    },
    {
      id: 5,
      src: "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/HomePage/cutePuppy.webp",
      title: "Cute Puppy",
    },
    {
      id: 6,
      src: "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/HomePage/shelter.jpeg",
      title: "Shelter Moments",
    },
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-purple-900">
            Our Journey in Pictures
          </h2>
          <p className="text-gray-600 mt-2 text-base md:text-lg max-w-2xl mx-auto">
            A collection of special moments — pets, people, and memories that
            inspire us every day.
          </p>
          <div className="w-20 h-1 bg-pink-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              <div className="relative w-full h-56">
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-gray-800 font-semibold text-lg">
                  {img.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import {
    Camera,
    Hammer,
    Tent,
    Plane
} from "lucide-react";

const categories = [
    {
        icon: Camera,
        title: "Camera"
    },
    {
        icon: Plane,
        title: "Drone"
    },
    {
        icon: Hammer,
        title: "Tools"
    },
    {
        icon: Tent,
        title: "Camping"
    }
];

export default function Categories() {
    return (
        <section className="py-20 bg-white">

            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-4xl font-bold text-center">
                    Popular Categories
                </h2>

                <div className="grid md:grid-cols-4 gap-8 mt-12">

                    {categories.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-3xl border bg-slate-50 p-10 text-center shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
                        >

                            <item.icon
                                className="mx-auto mb-6 text-blue-600"
                                size={52}
                            />

                            <h3 className="text-xl font-bold">
                                {item.title}
                            </h3>

                        </div>
                    ))}

                </div>

            </div>

        </section>
    );
}
import Link from "next/link";
import {
  Package,
  CalendarDays,
  Heart,
  Bell,
  Star,
  ArrowRight,
  Plus,
  TrendingUp,
  ShieldCheck,
  Clock,
} from "lucide-react";

const stats = [
  {
    title: "My Equipment",
    value: "12",
    change: "+2 this week",
    icon: Package,
    color: "bg-blue-500",
  },
  {
    title: "Bookings",
    value: "28",
    change: "+8 this month",
    icon: CalendarDays,
    color: "bg-green-500",
  },
  {
    title: "Wishlist",
    value: "14",
    change: "+3 saved",
    icon: Heart,
    color: "bg-pink-500",
  },
  {
    title: "Reviews",
    value: "42",
    change: "4.9 Rating",
    icon: Star,
    color: "bg-yellow-500",
  },
];

const bookings = [
  {
    item: "Canon EOS R6",
    renter: "John Smith",
    status: "Active",
  },
  {
    item: "DJI Mini 4 Pro",
    renter: "Emily Brown",
    status: "Pending",
  },
  {
    item: "Camping Tent",
    renter: "Michael",
    status: "Completed",
  },
];

const equipment = [
  {
    name: "Canon EOS R6",
    price: "$45/day",
    status: "Available",
  },
  {
    name: "DJI Mini 4 Pro",
    price: "$60/day",
    status: "Rented",
  },
  {
    name: "MacBook Pro",
    price: "$55/day",
    status: "Available",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      {/* Hero */}

      <section className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-10 text-white shadow-xl">

        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

          <div>

            <p className="text-blue-100">
              Welcome Back 👋
            </p>

            <h1 className="mt-2 text-5xl font-bold">
              Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-blue-100">
              Manage your equipment, bookings,
              rentals and earnings from one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="/equipment/create"
                className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition hover:scale-105"
              >
                <Plus size={20} />
                Add Equipment
              </Link>

              <Link
                href="/equipment"
                className="flex items-center gap-2 rounded-xl border border-white px-6 py-3 font-semibold transition hover:bg-white hover:text-blue-600"
              >
                Browse Equipment
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

          <div className="rounded-2xl bg-white/20 p-8 backdrop-blur-lg">

            <TrendingUp
              size={80}
              className="mx-auto mb-4"
            />

            <h2 className="text-center text-3xl font-bold">
              +24%
            </h2>

            <p className="text-center text-blue-100">
              Booking Growth
            </p>

          </div>

        </div>

      </section>

      {/* Stats */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-3 text-4xl font-bold">
                    {stat.value}
                  </h2>

                  <p className="mt-2 text-sm text-green-600">
                    {stat.change}
                  </p>

                </div>

                <div
                  className={`${stat.color} rounded-2xl p-4 text-white`}
                >
                  <Icon size={28} />
                </div>

              </div>
            </div>
          );
        })}

      </section>
            {/* Quick Actions */}

      <section className="grid gap-6 lg:grid-cols-4">

        <Link
          href="/equipment/create"
          className="rounded-2xl bg-blue-600 p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        >
          <Plus size={34} />

          <h2 className="mt-5 text-xl font-bold">
            Add Equipment
          </h2>

          <p className="mt-2 text-blue-100">
            List a new item for rent.
          </p>
        </Link>

        <Link
          href="/bookings"
          className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
        >
          <CalendarDays
            size={34}
            className="text-green-600"
          />

          <h2 className="mt-5 text-xl font-bold">
            My Bookings
          </h2>

          <p className="mt-2 text-gray-500">
            Manage all bookings.
          </p>
        </Link>

        <Link
          href="/wishlist"
          className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
        >
          <Heart
            size={34}
            className="text-pink-600"
          />

          <h2 className="mt-5 text-xl font-bold">
            Wishlist
          </h2>

          <p className="mt-2 text-gray-500">
            View saved equipment.
          </p>
        </Link>

        <Link
          href="/profile"
          className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
        >
          <ShieldCheck
            size={34}
            className="text-indigo-600"
          />

          <h2 className="mt-5 text-xl font-bold">
            Profile
          </h2>

          <p className="mt-2 text-gray-500">
            Manage your account.
          </p>
        </Link>

      </section>

      {/* Main Grid */}

      <section className="grid gap-8 xl:grid-cols-3">

        {/* Equipment */}

        <div className="xl:col-span-2 rounded-3xl bg-white p-8 shadow">

          <div className="mb-8 flex items-center justify-between">

            <h2 className="text-2xl font-bold">
              Recent Equipment
            </h2>

            <Link
              href="/equipment"
              className="text-blue-600 hover:underline"
            >
              View All
            </Link>

          </div>

          <div className="space-y-5">

            {equipment.map((item) => (

              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl border p-5 transition hover:bg-slate-50"
              >

                <div>

                  <h3 className="text-lg font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-gray-500">
                    {item.price}
                  </p>

                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    item.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status}
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* Trust Score */}

        <div className="rounded-3xl bg-white p-8 shadow">

          <div className="text-center">

            <ShieldCheck
              size={70}
              className="mx-auto text-blue-600"
            />

            <h2 className="mt-5 text-3xl font-bold">
              Trust Score
            </h2>

            <p className="mt-2 text-gray-500">
              Your community reputation
            </p>

            <div className="mt-8">

              <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-[10px] border-blue-500">

                <span className="text-5xl font-black text-blue-600">
                  92
                </span>

              </div>

            </div>

            <button className="mt-8 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
              Improve Score
            </button>

          </div>

        </div>

      </section>
            {/* Bottom Section */}

      <section className="grid gap-8 xl:grid-cols-2">

        {/* Recent Bookings */}

        <div className="rounded-3xl bg-white p-8 shadow">

          <div className="mb-8 flex items-center justify-between">

            <h2 className="text-2xl font-bold">
              Recent Bookings
            </h2>

            <Link
              href="/bookings"
              className="text-blue-600 hover:underline"
            >
              View All
            </Link>

          </div>

          <div className="space-y-5">

            {bookings.map((booking) => (

              <div
                key={booking.item}
                className="flex items-center justify-between rounded-2xl border p-5 transition hover:bg-slate-50"
              >

                <div>

                  <h3 className="font-semibold">
                    {booking.item}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Renter: {booking.renter}
                  </p>

                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    booking.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {booking.status}
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* Notifications */}

        <div className="rounded-3xl bg-white p-8 shadow">

          <div className="mb-8 flex items-center justify-between">

            <h2 className="text-2xl font-bold">
              Notifications
            </h2>

            <Bell
              className="text-blue-600"
              size={26}
            />

          </div>

          <div className="space-y-5">

            <div className="flex gap-4 rounded-2xl bg-blue-50 p-5">

              <Bell
                className="text-blue-600"
                size={22}
              />

              <div>

                <p className="font-semibold">
                  Booking Confirmed
                </p>

                <p className="text-sm text-gray-500">
                  Canon EOS R6 has been booked.
                </p>

              </div>

            </div>

            <div className="flex gap-4 rounded-2xl bg-green-50 p-5">

              <ShieldCheck
                className="text-green-600"
                size={22}
              />

              <div>

                <p className="font-semibold">
                  Profile Verified
                </p>

                <p className="text-sm text-gray-500">
                  Your account verification is complete.
                </p>

              </div>

            </div>

            <div className="flex gap-4 rounded-2xl bg-yellow-50 p-5">

              <Clock
                className="text-yellow-600"
                size={22}
              />

              <div>

                <p className="font-semibold">
                  Rental Reminder
                </p>

                <p className="text-sm text-gray-500">
                  Return your DJI Mini 4 Pro tomorrow.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Activity */}

      <section className="rounded-3xl bg-white p-8 shadow">

        <div className="mb-8 flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            Activity Overview
          </h2>

          <TrendingUp
            className="text-green-600"
            size={28}
          />

        </div>

        <div className="grid gap-6 md:grid-cols-4">

          <div className="rounded-2xl bg-slate-100 p-6 text-center">

            <Package
              size={36}
              className="mx-auto text-blue-600"
            />

            <h3 className="mt-4 text-3xl font-bold">
              12
            </h3>

            <p className="text-gray-500">
              Equipment Listed
            </p>

          </div>

          <div className="rounded-2xl bg-slate-100 p-6 text-center">

            <CalendarDays
              size={36}
              className="mx-auto text-green-600"
            />

            <h3 className="mt-4 text-3xl font-bold">
              28
            </h3>

            <p className="text-gray-500">
              Total Bookings
            </p>

          </div>

          <div className="rounded-2xl bg-slate-100 p-6 text-center">

            <Star
              size={36}
              className="mx-auto text-yellow-500"
            />

            <h3 className="mt-4 text-3xl font-bold">
              4.9
            </h3>

            <p className="text-gray-500">
              Average Rating
            </p>

          </div>

          <div className="rounded-2xl bg-slate-100 p-6 text-center">

            <TrendingUp
              size={36}
              className="mx-auto text-purple-600"
            />

            <h3 className="mt-4 text-3xl font-bold">
              +24%
            </h3>

            <p className="text-gray-500">
              Monthly Growth
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}
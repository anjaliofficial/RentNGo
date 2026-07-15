import Container from "./Container";

export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-white py-8">
      <Container>
        <div className="text-center text-gray-600">
          © {new Date().getFullYear()} RentNGo. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
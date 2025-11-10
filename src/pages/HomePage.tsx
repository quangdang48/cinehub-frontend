import FooterHome from "../components/home/FooterHome";
import HeaderHome from "../components/home/HeaderHome";
import SectionContent from "../components/home/SectionContent";
import SectionFilm from "../components/home/SectionFilm";

export default function HomePage() {
  return (
    <div>
      <HeaderHome/>
      <SectionContent/>
      <SectionFilm/>
      <FooterHome/>
    </div>
  );
}

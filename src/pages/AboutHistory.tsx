import { Seo } from '../components/Seo';
import { defaultDescription, titleForPage } from '../data/site';
import './pages.css';
import './AboutHistory.css';

const ext = (href: string, label: string) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {label}
  </a>
);

const AboutHistory: React.FC = () => (
  <main className="page">
    <Seo title={titleForPage('My History')} description={defaultDescription} path="/about/history" />

    <section className="page-hero">
      <span className="section-label">About</span>
      <h1 className="section-title">My History</h1>
      <p className="history-intro">
        My career has been shaped by curiosity, self-learning, and the habit of building things
        before I felt fully ready. I started by modifying Blogger templates as a teenager, then
        moved through university, Java, full-stack JavaScript, developer communities, agencies,
        startups, and international teams. Across all those stages, the pattern has been the same:
        I learn by experimenting, sharing, and building with others.
      </p>
    </section>

    <hr className="section-divider" />

    <section className="page-section history-bio">
      <article className="history-bio__chapter">
        <h2 className="history-bio__title">Early Experiments with Tech at School</h2>
        <p>
          Everything started when I was 14 and wanted to create a website, even though I had no
          idea how to build one. During that process, I discovered{' '}
          {ext('https://en.wikipedia.org/wiki/Blogger_%28service%29', 'Blogger')} and quickly
          noticed that its themes had a kind of template configuration. I realized the code
          contained links to the images used in the blog&apos;s design, so I began replacing those
          links with my own images.
        </p>
        <p>
          Eventually, I started modifying the {ext('https://en.wikipedia.org/wiki/CSS', 'CSS')},
          although I did not know at the time that it was CSS. I was simply experimenting,
          breaking things, and learning by observing what changed.
        </p>
        <p>
          Over the next two years, I taught myself some{' '}
          {ext('https://en.wikipedia.org/wiki/Visual_Basic', 'Visual Basic')} and{' '}
          {ext('https://en.wikipedia.org/wiki/Macromedia_Flash', 'Flash')}. I was also introduced
          to {ext('https://en.wikipedia.org/wiki/C%2B%2B', 'C++')} and{' '}
          {ext(
            'https://en.wikipedia.org/wiki/Visual_Basic_for_Applications',
            'Visual Basic for Applications',
          )}{' '}
          at school.
        </p>
        <p>
          One moment I still remember clearly was during my final school project. I needed to
          repeat a task many times, but I had no idea that a <code>for</code> statement existed. A
          friend&apos;s brother-in-law explained it to me, and it felt mind-blowing. It was one of
          the first moments when I understood that programming was not just about writing
          instructions, but about finding better ways to solve problems.
        </p>
        <p>
          That experience shaped one of the habits that has stayed with me throughout my career:
          learning by experimenting, observing what changes, and improving through curiosity.
        </p>
      </article>

      <article className="history-bio__chapter">
        <h2 className="history-bio__title">Fortunate Foundations at University</h2>
        <p>
          I enrolled in Systems Engineering at university mostly because my friends were doing it.
          At the time, I believed I could learn programming on my own through the internet, which
          was not entirely wrong. I was also considering a more design-oriented career, since I
          was exploring{' '}
          {ext('https://en.wikipedia.org/wiki/Adobe_Photoshop', 'Photoshop')} retouching and video
          editing with {ext('https://en.wikipedia.org/wiki/Vegas_Pro', 'Sony Vegas Pro')}.
        </p>
        <p>
          University taught me many important fundamentals, but it was during an extra summer
          course that I truly became interested in web development. In that program, I learned{' '}
          {ext('https://en.wikipedia.org/wiki/PHP', 'PHP')},{' '}
          {ext('https://en.wikipedia.org/wiki/MySQL', 'MySQL')},{' '}
          {ext('https://en.wikipedia.org/wiki/JQuery', 'jQuery')}, and more CSS.
        </p>
        <p>
          Although I struggled with foundational subjects like Calculus, Geometry, and Physics,
          that also pushed me to take more advanced courses. One of the most important was{' '}
          {ext('https://en.wikipedia.org/wiki/Software_design_pattern', 'Design Patterns')}, which
          became crucial for my professional growth. Looking back, I am glad I took those advanced
          courses early, because they helped me build a stronger foundation as a software
          engineer.
        </p>
        <p>
          This stage taught me that formal education and self-learning do not compete with each
          other; they can complement each other when curiosity is the driving force.
        </p>
      </article>

      <article className="history-bio__chapter">
        <h2 className="history-bio__title">First Steps into the Tech Industry</h2>
        <p>
          While I was still at university, I received two job offers and interviewed for both. One
          was for a PHP position, where I had more experience thanks to the summer course.
          However, the role required working with{' '}
          {ext('https://en.wikipedia.org/wiki/CakePHP', 'CakePHP')}, a framework I did not
          particularly enjoy.
        </p>
        <p>
          The other opportunity involved{' '}
          {ext('https://en.wikipedia.org/wiki/Java_%28programming_language%29', 'Java')} and many
          advanced concepts I was not familiar with yet. The person hiring me was willing to teach
          me, so I chose that role because I saw it as a better opportunity to learn and grow.
        </p>
        <p>
          Unfortunately, after six months, the company went bankrupt. Thanks to a recommendation
          from my former boss, I joined another company in a similar role. That experience helped
          me grow significantly and become a more well-rounded engineer.
        </p>
        <p>
          Looking back, that decision became an early example of choosing growth over comfort, a
          pattern that has repeated throughout my career.
        </p>
      </article>

      <article className="history-bio__chapter">
        <h2 className="history-bio__title">From Java to Full-stack JavaScript</h2>
        <p>
          As I continued learning, I realized that building large web applications required me to
          understand both Java and JavaScript. Over time, however, I found Java too verbose and
          complicated for the kind of work I wanted to do, while JavaScript felt more flexible and
          enjoyable.
        </p>
        <p>
          Around that time, I discovered{' '}
          {ext('https://en.wikipedia.org/wiki/Node.js', 'Node.js')}, which made it possible to use
          JavaScript on the server. That changed the way I thought about full-stack development.
          Focusing on one language across both frontend and backend felt like a practical path
          toward becoming a stronger full-stack developer.
        </p>
        <p>
          Like PHP, JavaScript with frameworks such as{' '}
          {ext('https://en.wikipedia.org/wiki/Express.js', 'Express.js')} made it simple to set up
          a server quickly. When ES6, or{' '}
          {ext(
            'https://en.wikipedia.org/wiki/ECMAScript_version_history#6th_Edition_%E2%80%93_ECMAScript_2015',
            'ECMAScript 2015',
          )}
          , was released, I dove into its new features, which made JavaScript even more powerful
          and enjoyable to work with.
        </p>
        <p>
          Frameworks like{' '}
          {ext('https://en.wikipedia.org/wiki/Meteor_%28web_framework%29', 'Meteor')} reinforced
          this idea by making it easier to build web and mobile applications with a shared
          codebase. This approach felt efficient, practical, and aligned with the kind of engineer
          I wanted to become. It solidified my decision to specialize in JavaScript.
        </p>
        <p>
          This transition taught me to look for tools that help me move across the whole product,
          from interface to server, from idea to implementation.
        </p>
      </article>

      <article className="history-bio__chapter">
        <h2 className="history-bio__title">Transitioning to Working in English</h2>
        <p>
          My first job that required English was an important turning point. During the interview,
          the CEO told me my English level was a 3 out of 5. Surprisingly, I felt good about that,
          because I had expected it to be lower.
        </p>
        <p>
          At first, I used English mostly during stand-up meetings. I practiced basic phrases,
          learned how to say ticket numbers, and answered the usual questions: what I had done
          yesterday, what I was working on that day, and whether I had any blockers. In the
          beginning, I rarely gave much detail beyond mentioning the ticket numbers I was working
          on.
        </p>
        <p>
          Over time, I became more comfortable, especially during technical meetings where
          frontend engineers discussed best practices and proposed solutions. Those discussions
          had to happen in English because, although most of us spoke Spanish, one engineer only
          spoke English. That pushed me to improve.
        </p>
        <p>
          I also started taking English lessons, but the biggest progress came when I worked with
          a team where half of the people were based in New York. From that point on, English
          became a natural part of my work. It has remained a continuous learning process ever
          since.
        </p>
        <p>
          That experience taught me that communication improves the same way technical skills do:
          by using it every day, making mistakes, and staying exposed to situations that force you
          to improve.
        </p>
      </article>

      <article className="history-bio__chapter">
        <h2 className="history-bio__title">Growing Developer Communities</h2>
        <p>
          My journey into tech communities began when I started attending local meetups such as{' '}
          {ext('https://www.meetup.com/medellinjs/', 'MedellinJS')},{' '}
          {ext('https://www.meetup.com/medellin-php/', 'MedellinPHP')}, and other technology
          groups. I was inspired by how communities could help developers grow, share knowledge,
          and find opportunities.
        </p>
        <p>
          I noticed that many community talks were valuable, but there was also room to improve
          how technical content was presented. That motivated me to start giving talks myself. Not
          because I thought I was better, but because I saw an opportunity to help others learn
          while deepening my own understanding.
        </p>
        <p>
          I also encouraged others to share what they knew, emphasizing that everyone starts
          somewhere.
        </p>
        <p>
          Later, I noticed there was no dedicated space for{' '}
          {ext('https://en.wikipedia.org/wiki/CSS', 'CSS')} enthusiasts in Medellín. Together with
          two friends, I created a CSS community that grew beyond our expectations. Our meetups
          consistently attracted around 100 attendees, which introduced new challenges, such as
          finding venues large enough to host everyone.
        </p>
        <p>
          The success of that community eventually led us to organize Colombia&apos;s first CSS
          conference. It was a milestone that showed the growing interest in web technologies in
          the region.
        </p>
        <p>
          Running these communities taught me valuable lessons about leadership, event
          organization, communication, and the importance of creating spaces where developers can
          learn from each other.
        </p>
        <p>
          Those communities also taught me that sharing knowledge is not separate from learning;
          it is one of the strongest ways to deepen it.
        </p>
      </article>

      <article className="history-bio__chapter">
        <h2 className="history-bio__title">Building My Own Design Agency</h2>
        <p>
          During this period, I also started a design agency with a designer I had met at Komet
          Sales. We called it <strong>Space Monkeys</strong>. Together, we worked on several
          projects, including <strong>Docmeti</strong>, <strong>Mr. Och8</strong>, and{' '}
          <strong>Speed</strong>.
        </p>
        <p>
          At Komet Sales, I met a designer who was unusually open to suggestions from a
          development perspective. At the time, the concept of a web designer was still emerging,
          and many designers were still working from a traditional print-design mindset. Concepts
          like responsive design, Bootstrap, and accessibility were often ignored.
        </p>
        <p>
          With this designer, however, there was a strong understanding of how important those
          elements were for the web. We collaborated well because we shared the same interest in
          combining design quality with technical feasibility.
        </p>
        <p>
          Eventually, he left the company, but we stayed in touch and began collaborating on small
          freelance projects. After a few successful projects, we saw a larger opportunity in the
          market. Many agencies were not fully embracing new technologies and web trends, so we
          decided to create our own agency with the goal of doing things differently.
        </p>
        <p>That was how Space Monkeys was born.</p>
        <p>
          We delivered many successful projects, but the digital agency space was highly
          saturated. In the end, success often depended on having access to the right clients.
          Larger clients were sometimes hesitant to trust a small agency, even when we produced
          strong results. Ironically, some larger agencies that lacked technical expertise
          outsourced work to us.
        </p>
        <p>
          We worked on projects for companies such as <strong>Argos</strong> and{' '}
          <strong>GPM</strong>, as well as smaller projects like <strong>La Piel Plus</strong> and{' '}
          <strong>Speed</strong>. Our work ranged from e-commerce sites and mobile applications to
          interactive games and advanced web applications.
        </p>
        <p>
          Running Space Monkeys was a valuable experience. I learned how to work with clients,
          manage employees, and understand what it takes to run a business. I also gained a deeper
          appreciation for design by being involved in day-to-day creative processes. It taught me
          how to optimize workflows, communicate better across disciplines, and build products
          with both technical and visual quality in mind.
        </p>
        <p>
          Space Monkeys helped me understand that building good digital products requires more
          than code: it requires design awareness, communication, trust, and the ability to turn
          unclear ideas into working products.
        </p>
      </article>

      <article className="history-bio__chapter">
        <h2 className="history-bio__title">A Journey into Startups</h2>
        <p>
          My first real startup experience was with <strong>Docmeti</strong>, a personalized
          skincare subscription built around each customer&apos;s skin type. It was one of my
          first opportunities to build not only software, but also a product deeply connected to
          operations, laboratories, packaging, and distribution.
        </p>
        <p>
          I worked on the platform, e-commerce flows, payments, orders, and integrations, while
          also contributing to the product and brand. From that project, we also developed{' '}
          <strong>Mr. Och8</strong>, a tattoo aftercare line that later helped us win{' '}
          <strong>Capital Semilla</strong> in Antioquia. It was a formative experience that taught
          me how much range, adaptability, and resilience startup life requires.
        </p>
        <p>
          After that came <strong>Workia</strong>, a startup built around the idea of a global
          coworking pass. We moved quickly, launched early, solved problems in real time, and
          built both web and mobile experiences as the product evolved.
        </p>
        <p>
          The company gained traction, partnerships, and investor interest, but the pandemic
          forced us to pivot quickly. Although the new product showed promise, the team was
          already worn down, and we eventually decided to close the company.
        </p>
        <p>
          Together, those experiences gave me a broader view of what it means to build under
          uncertainty. <strong>Docmeti</strong> taught me the complexity of physical products and
          operations, while <strong>Workia</strong> showed me the speed, ambition, and emotional
          intensity of startup life.
        </p>
        <p>
          Those startup experiences reinforced one of the most important lessons in my career:
          building products requires adaptability, resilience, and the ability to keep learning
          while the context around you changes.
        </p>
      </article>
    </section>
  </main>
);

export default AboutHistory;

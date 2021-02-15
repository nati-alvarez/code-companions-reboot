//This will be the landing page

//styles
import styles from "@styles/Landing.module.scss";
//components
import Navbar from "@components/Navbar.tsx";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <main className={styles.main}>
        <header className={styles.header}>
          <small className={styles["small-text"]}>Welcome to</small>
          <img  width="250" className={styles["logo-large"]} src="/logo-l.png" alt="Heart inside html brackets"/>
          <h1>Code_Companions</h1>
          <button>Signup</button>
          <p>Code_Companions is a platform for you meet other developers, and collaborate
          with them on awesome coding projects. From listing a project, to meeting up with
          and inviting other developers, all the way to working together on the project, all
          of it can be done right here! This is your one-stop development shop!</p>
        </header>
        <section className={styles.section}>
          <h2>How it Works</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <img src={"/placeholder.gif"}/>
              <p>Create an account, and fill out your
              profile info</p>
            </div>
            <div className={styles.step}>
              <img src={"/placeholder.gif"}/>
              <p>Look for a project to join or create your own. 
              Send or accept invites to the project.</p>
            </div>
            <div className={styles.step}>
              <img src={"/placeholder.gif"}/>
              <p>Get into your project and start 
              working! Use the chat channels,
              task board, and git integration to
              make swesome projects.</p>
            </div>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.plugs}>
            <div>
              <h2>Social Hub</h2>
              <p>Do you have any ideas, thoughts, or just
              cool stuff you wanna share with the 
              community? Or see the same from
              your peers? Check out the social
              hub</p>
              <button className={styles["primary-button-wide"]}>
                Check it Out!
              </button>
            </div>
            <div>
              <h2>Our Blog</h2>
              <p>Check out the latest tech news,
              tutorials, and site wide announcements  on our blog!
              </p>
              <button className={styles["secondary-button-wide"]}>
                Check it Out!
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

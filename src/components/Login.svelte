<script>
  import { goto, stores } from "@sapper/app";
  import { post } from "api";
  import routes from "routes";

  const { session } = stores();
  let valid;
  let forbidden = false;
  let error = false;

  function handleInput({ target }) {
    valid = target.reportValidity();
  }

  async function handleSubmit({ target }) {
    if (!target.checkValidity()) return;

    const response = await post({
      path: routes.sapper.login,
      body: {
        Username: target.username.value,
        Password: target.password.value
      }
    });

    if (response.ok) {
      $session.companies = response.message;
      $session.loggedIn = true;
      return await goto(routes.site.contacts);
    } else if (response.status === 401) {
      forbidden = true;
    } else {
      error = true;
    }
    target.reset();
  }
</script>

<style>
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 180px;
  }

  label {
    width: 100%;
    color: rgba(52, 52, 52, 0.8);
    margin-top: 15px;
  }

  input[type="text"],
  input[type="password"] {
    margin-bottom: 0;
    border: thin solid black;
    box-sizing: border-box;
    width: 100%;
  }

  input[type="submit"] {
    font-size: 1.3em;
    margin: 30px;
    border-radius: 3px;
    background-color: #0070e0;
    color: white;
    border: none;
    padding: 10px 50px;
    cursor: pointer;
  }

  p {
    text-align: center;
    color: red;
    font-size: 0.8rem;
  }
  .powered {
    color: rgba(82, 82, 82, 0.7);
  }

  img {
    width: 220px;
    margin-bottom: 40px;
  }

  a {
    text-decoration: none;
    cursor: unset;
    color: inherit;
  }
</style>

<form on:submit|preventDefault={handleSubmit} on:input={handleInput}>
  <img src="unieconomy.png" alt="unimicrologo" />

  <label for="username">E-mail</label>
  <input id="username" name="username" type="text" required />

  <label for="password">Password</label>
  <input id="password" name="password" type="password" required />

  <input type="submit" disabled={valid ? null : 'disabled'} value="Login" />
  {#if forbidden}
    <p>Username or password is incorrect</p>
  {:else if error}
    <p>Something went wrong</p>
  {/if}

  <p class="powered">
    <a href="https://www.friele.no/">Powered by Coffee</a>
  </p>
</form>

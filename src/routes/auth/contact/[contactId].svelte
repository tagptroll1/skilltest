<script context="module">
  import * as api from "api";
  import routes from "routes";

  export async function preload({ params }, { loggedIn }) {
    const path = routes.sapper.contactId(params.contactId);
    const { message, ok, status } = await api.get({ path }, this.fetch);

    if (!ok) {
      this.error(status, message);
    }

    return { contact: message };
  }
</script>

<script>
  export let contact;

  import EditIcon from "@components/EditIcon.svelte";
  import DeleteContactIcon from "@components/DeleteContactIcon.svelte";
  import { stores, goto } from "@sapper/app";
  const { session } = stores();

  const {
    ID,
    Info: { Name, DefaultEmail, DefaultPhone, InvoiceAddress },
    Comment,
    Role
  } = contact;

  $session.customerName = Name;

  function handleDelete() {
    const returnValue = confirm(
      `Are you sure you want to delete ${Name}?\nThis is irreversible!`
    );

    if (returnValue) {
      const path = routes.sapper.contactId(ID);
      api.del({ path }).then(({ ok }) => {
        if (ok) {
          goto(routes.site.contacts);
        }
      });
    }
  }
</script>

<style>
  article {
    margin: 0 20px;
  }

  h1 {
    text-align: center;
  }

  h1 span {
    display: block;
    color: rgb(138, 138, 138);
    font-size: 1rem;
  }

  .buttons {
    display: flex;
    justify-content: center;
  }

  ul {
    display: flex;
    flex-direction: column;

    align-items: center;

    padding: 0;
  }

  li {
    width: 40%;
    font-size: 1.5rem;
    list-style: none;
    margin: 5px 0;
  }

  li span {
    font-size: 1rem;
    display: block;
  }

  a,
  button {
    text-decoration: none;
    cursor: pointer;
    box-sizing: content-box;
    padding: 8px 10px;

    background-color: unset;
    border: none;
    font-size: 0.8em;
    font-family: var(--font-family);
  }

  .address {
    display: block;
  }
</style>

<article>
  <h1>
    {Name}
    {#if Role}
      <span>{Role}</span>
    {/if}
  </h1>

  <div class="buttons">

    <a href={routes.site.editContact(ID)}>
      <EditIcon />
      Edit
    </a>

    <button on:click={handleDelete}>
      <DeleteContactIcon />
      Delete
    </button>

  </div>

  <ul>

    {#if DefaultEmail}
      <li>
        E-Mail
        <span>{DefaultEmail.EmailAddress || ''}</span>
      </li>
    {/if}

    {#if DefaultPhone}
      <li>
        Phonenumber
        <span>{DefaultPhone.Number || ''}</span>
      </li>
      <li>
        Comment
        <span>{Comment || ''}</span>
      </li>
    {/if}

    {#if InvoiceAddress}
      <li>
        Address
        <span class="address">{InvoiceAddress.AddressLine1 || ''}</span>
        <span class="address">{InvoiceAddress.AddressLine2 || ''}</span>
        <span class="address">{InvoiceAddress.AddressLine3 || ''}</span>
      </li>
      <li>
        Postal Code
        <span>{InvoiceAddress.PostalCode || ''}</span>
      </li>

      <li>
        City
        <span>{InvoiceAddress.City || ''}</span>
      </li>

      <li>
        Country
        <span>{InvoiceAddress.Country || ''}</span>
      </li>
    {/if}
  </ul>

</article>

<template>
  <main class="flex flex-col w-full h-screen justify-center max-w-7xl gap-6 mx-auto">
    <h1 class="text-4xl font-semibold text-blue-500">Permissões do usuário</h1>
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-semibold mt-5 text-gray-700">Funcionalidades</h2>
      <Tree 
        v-model:selectionKeys="selecionados"
        :value="arvoresFuncionalidades"
        selectionMode="checkbox"
        class="w-full md:max-w-2xl"
        @selection-change="aoAlterarSelecao"
      />

      <button
        class="max-w-3xs mt-6 bg-blue-500 text-white p-3 cursor-pointer rounded hover:bg-blue-700 transition duration-500"
        @click="salvarPermissoes"
      >
        Salvar Permissões
      </button>
    </section>
  </main>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import Tree from 'primevue/tree';

  const idUsuario = 1;

  const arvoresFuncionalidades = ref([]);
  const selecionados = ref({});
  const apiUrl = import.meta.env.VITE_API_URL;

  onMounted(() => {
    carregarDados();
  });

  async function carregarDados() {
    try {
      const respostaFuncionalidades = await axios.get(`${apiUrl}/funcionalidades`);
      const funcionalidades = respostaFuncionalidades.data;

      console.log('Funcionalidades carregadas:', funcionalidades);

      const respostaPermissoes = await axios.get(`${apiUrl}/permissoes-usuarios/usuario/${idUsuario}`);
      const permissoesUsuarios = respostaPermissoes.data.map(permissao => permissao.funcionalidadeId);

      console.log('Permissões do usuário carregadas:', permissoesUsuarios);

      const mapaFuncionalidades = {};

      funcionalidades.forEach(funcionalidade => {
        mapaFuncionalidades[funcionalidade.id] = {
          key: funcionalidade.id,
          label: funcionalidade.nome,
          children: []
        }
      });

      const arvore = [];

      funcionalidades.forEach(funcionalidade => {
        if (funcionalidade.id_owner) {
          mapaFuncionalidades[funcionalidade.id_owner].children.push(mapaFuncionalidades[funcionalidade.id]);
        } else {
          arvore.push(mapaFuncionalidades[funcionalidade.id]);
        }
      })

      arvoresFuncionalidades.value = arvore;

      permissoesUsuarios.forEach(id => {
        selecionados.value[id] = { checked: true };
      })

      console.log('Árvore de funcionalidades:', arvoresFuncionalidades.value);
      console.log('Funcionalidades selecionadas:', selecionados.value);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados do servidor. Veja o console para mais detalhes.');
    }
  }

  function aoAlterarSelecao(event) {
    selecionados.value = event.value;
  }

  async function salvarPermissoes() {
    try {
      const funcionalidadesSelecionadas = Object.keys(selecionados.value);

      await axios.put(`${apiUrl}/permissoes-usuarios/${idUsuario}`, {
        funcionalidades: funcionalidadesSelecionadas
      });

      alert('Permissões salvas com sucesso!');

    } catch (error) {
      console.error('Erro ao salvar permissões:', error);
      alert('Erro ao salvar permissões. Veja o console para mais detalhes.');
    }
  }

</script>

<style scoped>
</style> 
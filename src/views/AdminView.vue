<template>
  <div class="admin-layout">
    <!-- Admin Sidebar -->
    <aside class="admin-sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon"><i class="bi bi-shield-lock-fill"></i></div>
        <span class="brand-name">Painel Admin</span>
      </div>

      <nav class="sidebar-menu">
        <a
          class="menu-item"
          :class="{ active: activeAdminTab === 'upload-template' }"
          @click="activeAdminTab = 'upload-template'"
        >
          <i class="bi bi-cloud-upload-fill"></i>
          <span>Subir Template</span>
        </a>

        <a
          class="menu-item"
          :class="{ active: activeAdminTab === 'manage-templates' }"
          @click="activeAdminTab = 'manage-templates'"
        >
          <i class="bi bi-grid-1x2-fill"></i>
          <span>Gerenciar Templates</span>
          <span class="badge-count">{{ customTemplatesRegistry.length }}</span>
        </a>

        <a
          class="menu-item"
          :class="{ active: activeAdminTab === 'stats' }"
          @click="activeAdminTab = 'stats'"
        >
          <i class="bi bi-bar-chart-line-fill"></i>
          <span>Estatísticas</span>
        </a>

        <a
          class="menu-item"
          :class="{ active: activeAdminTab === 'users' }"
          @click="activeAdminTab = 'users'"
        >
          <i class="bi bi-people-fill"></i>
          <span>Usuários</span>
        </a>
      </nav>

      <div class="sidebar-back-box">
        <button class="btn-back-dashboard" @click="$emit('navigate', 'dashboard')">
          <i class="bi bi-arrow-left"></i> Voltar ao Dashboard
        </button>
      </div>
    </aside>

    <!-- Main Admin Workspace -->
    <div class="admin-main">
      <header class="admin-header">
        <div class="header-title-box">
          <h2>⚙️ Gestão de Templates & Plataforma</h2>
          <span class="admin-badge">Modo Administrador</span>
        </div>

        <div class="header-actions">
          <button class="btn-builder-link" @click="openBuilderWorkspace()">
            <i class="bi bi-diagram-3-fill"></i> Abrir Construtor Visual
          </button>
        </div>
      </header>

      <main class="admin-content">
        <!-- ABA 1: SUBIR TEMPLATE (UPLOAD HTML & SALVAR JSON) -->
        <div v-if="activeAdminTab === 'upload-template'" class="upload-template-view">
          <div class="view-header">
            <h3>📤 Subir & Publicar Template em JSON</h3>
            <p>Envie ou cole o código HTML exportado pelo builder. O sistema converterá automaticamente em estrutura JSON reativa para ser carregada no construtor.</p>
          </div>

          <div class="admin-grid-layout">
            <!-- Form Card -->
            <div class="admin-card-panel">
              <form @submit.prevent="handleUploadTemplate">
                <div class="form-group">
                  <label class="form-label">Nome do Template *</label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="ex: Template VSL Especial Dollar App 2026"
                    required
                    v-model="templateForm.name"
                  />
                </div>

                <div class="form-row-2">
                  <div class="form-group">
                    <label class="form-label">Categoria *</label>
                    <select class="form-select" v-model="templateForm.category">
                      <option value="VSL">VSL (Vídeo de Vendas)</option>
                      <option value="Funil">Funil completo</option>
                      <option value="Upsell">Upsell 1-Click</option>
                      <option value="Downsell">Downsell</option>
                      <option value="Captura">Captura / Lead</option>
                      <option value="E-mail">E-mail Marketing</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Status de Publicação</label>
                    <select class="form-select" v-model="templateForm.status">
                      <option value="Publicado">Publicado (Disponível no Builder)</option>
                      <option value="Rascunho">Rascunho (Privado Admin)</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Descrição Curta</label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="ex: Estrutura otimizada com player VTurb e pitch delay."
                    v-model="templateForm.description"
                  />
                </div>

                <!-- File Uploader & Code Textarea -->
                <div class="form-group">
                  <label class="form-label">Upload de Arquivo `.html` ou Cole o Código HTML Exportado *</label>

                  <!-- Drag and Drop Box -->
                  <div class="file-dropzone" @click="triggerFileInput">
                    <i class="bi bi-file-earmark-code-fill drop-icon"></i>
                    <span class="drop-text">{{ selectedFileName || 'Clique para selecionar um arquivo .html ou solte aqui' }}</span>
                    <input
                      type="file"
                      ref="fileInputRef"
                      accept=".html,.htm"
                      style="display: none;"
                      @change="handleFileSelect"
                    />
                  </div>

                  <div class="code-or-divider">OU COLE O CÓDIGO HTML DIRETO</div>

                  <textarea
                    class="code-textarea"
                    rows="9"
                    placeholder="<!DOCTYPE html>... cole o HTML completo exportado pelo builder aqui ..."
                    v-model="templateForm.htmlCode"
                    required
                  ></textarea>
                </div>

                <button type="submit" class="btn-submit-upload">
                  <i class="bi bi-cloud-arrow-up-fill"></i> Salvar e Converter em JSON para o Builder
                </button>
              </form>
            </div>

            <!-- Realtime Preview & JSON Export Card -->
            <div class="admin-card-panel preview-panel">
              <h4>🔍 Estrutura JSON Gerada</h4>
              <p class="panel-subtitle">Conversão automática em objetos do Construtor</p>

              <div v-if="parsedPreview" class="parsed-details">
                <div class="detail-item">
                  <span class="detail-label">Título da Página:</span>
                  <span class="detail-val">{{ parsedPreview.pageSettings.pageTitle }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Cor de Fundo:</span>
                  <span class="detail-val">
                    <span class="color-dot" :style="{ background: parsedPreview.pageSettings.bgColor }"></span>
                    {{ parsedPreview.pageSettings.bgColor }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Seções (Rows) JSON:</span>
                  <span class="detail-val">{{ parsedPreview.rows.length }} blocos de linhas</span>
                </div>

                <div class="elements-found-box">
                  <h5>Elementos Detectados no JSON:</h5>
                  <ul>
                    <li v-for="(type, idx) in detectedElementTypes" :key="idx">
                      <i class="bi bi-check-circle-fill check-icon"></i> {{ type }}
                    </li>
                  </ul>
                </div>

                <button class="btn-download-json" @click="downloadJSONFile">
                  <i class="bi bi-download"></i> Baixar Arquivo JSON do Template
                </button>
              </div>

              <div v-else class="empty-parse-box">
                <i class="bi bi-code-slash empty-parse-icon"></i>
                <p>Cole ou selecione um arquivo HTML exportado do Builder para gerar a estrutura em JSON automaticamente.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ABA 2: GERENCIAR TEMPLATES -->
        <div v-else-if="activeAdminTab === 'manage-templates'" class="manage-templates-view">
          <div class="view-header">
            <h3>🎨 Gerenciamento de Templates em JSON</h3>
            <p>Lista de todos os modelos de templates em formato JSON salvos na plataforma.</p>
          </div>

          <div class="templates-table-card">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Nome do Template</th>
                  <th>Categoria</th>
                  <th>Status</th>
                  <th>Formato</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tmpl in customTemplatesRegistry" :key="tmpl.id">
                  <td class="font-bold-td">
                    <i class="bi bi-file-earmark-code-fill" style="color: #6366f1; margin-right: 8px;"></i>
                    {{ tmpl.name }}
                  </td>
                  <td><span class="category-pill">{{ tmpl.category }}</span></td>
                  <td><span class="status-pill">{{ tmpl.status || 'Publicado' }}</span></td>
                  <td><span class="json-badge">JSON (.json)</span></td>
                  <td class="actions-td">
                    <button class="btn-tbl-use" @click="openTemplateInBuilder(tmpl.id)" title="Abrir no Builder">
                      <i class="bi bi-play-circle-fill"></i> Abrir no Builder
                    </button>
                    <button class="btn-tbl-action" @click="deleteTemplate(tmpl.id)" title="Excluir">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ABA 3: ESTATÍSTICAS DO SISTEMA -->
        <div v-else-if="activeAdminTab === 'stats'" class="stats-view">
          <div class="view-header">
            <h3>📊 Estatísticas Globais de Templates</h3>
          </div>

          <div class="stats-cards-grid">
            <div class="stat-card-box">
              <div class="stat-icon" style="background: rgba(99, 102, 241, 0.15); color: #818cf8;"><i class="bi bi-diagram-3-fill"></i></div>
              <div>
                <div class="stat-val">{{ customTemplatesRegistry.length }}</div>
                <div class="stat-lbl">Templates Salvos em JSON</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ABA 4: USUÁRIOS -->
        <div v-else-if="activeAdminTab === 'users'" class="users-view">
          <div class="view-header">
            <h3>👤 Gestão de Usuários</h3>
          </div>
          <div class="admin-card-panel">
            <p style="color: #94a3b8;">Lista de administradores e clientes ativos no sistema.</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { parseHTMLToBuilderState } from '../utils/htmlImporter';
import { useBuilderStore } from '../composables/useBuilderStore';

defineEmits(['navigate', 'open-builder']);
const router = useRouter();

const { showToast, registerCustomTemplate, customTemplatesRegistry, loadTemplate } = useBuilderStore();

const activeAdminTab = ref('upload-template');
const fileInputRef = ref(null);
const selectedFileName = ref('');

const templateForm = reactive({
  name: '',
  category: 'VSL',
  status: 'Publicado',
  description: '',
  htmlCode: ''
});

// Pre-fill with the VSL example provided by default if empty
onMounted(() => {
  if (customTemplatesRegistry.length === 0) {
    registerCustomTemplate({
      id: 'tmpl-vsl-dollar',
      key: 'tmpl-vsl-dollar',
      name: 'Página de Vendas VSL Dollar App (JSON)',
      category: 'VSL',
      status: 'Publicado',
      description: 'VSL de alta conversão com player VTurb e pitch button.',
      date: 'Cadastrado agora',
      json: parseHTMLToBuilderState(`
        <div class="vsl-container" style="background-color: #191919; color: #ffffff;">
          <div class="builder-row has-top-banner"><div class="builder-col" style="flex: 1;"><div class="canvas-element is-top-banner" data-element-type="top-banner"><div class="canvas-top-banner" style="background: #dc2626; color: #ffffff; font-weight: 800; text-align: center; padding: 12px 16px; font-size: 15px; width: 100%;">⚠️ ATENÇÃO NÃO FECHE ESTA PÁGINA - PODE DAR ERRO NA SUA COMPRA ⚠️</div></div></div></div>
          <div class="builder-row"><div class="builder-col" style="flex: 1;"><div class="canvas-element" data-element-type="heading"><h2 class="canvas-heading" style="font-size:30px; font-weight:900; color:#ffffff; margin:10px auto; text-align:center;">RECADO ESPECIAL PARA VOCÊ<br>Algo Para <span style="color: #f1c232;">Triplicar</span> Seus Ganhos com a Dollar App</h2></div></div></div>
          <div class="builder-row"><div class="builder-col" style="flex: 1;"><div class="canvas-element" data-element-type="vturb-player"><div class="canvas-vturb-wrapper" style="margin: 0 auto; width: 100%; max-width: 300px;"><vturb-smartplayer id="vid-6a6d621a6a693d904c682e0b" style="display: block; margin: 0 auto; width: 100%; max-width: 300px;"><div class="vturb-player-placeholder" style="position: relative; width: 100%; padding: 177.77777777777777% 0 0; z-index: 0; background-color: black;"></div></vturb-smartplayer></div></div></div></div>
          <div class="builder-row"><div class="builder-col" style="flex: 1;"><div class="canvas-element" data-element-type="pitch-button"><div style="text-align:center; width: 100%;"><a href="#" target="_blank" class="canvas-pitch-btn" style="display:inline-block; padding:14px 24px; border-radius:12px; text-decoration:none; background-color:#ffffff; font-size:20px; font-weight:700; color:#000000;"><span style="display:block;">QUERO MEU ACESSO AGORA</span></a></div></div></div></div>
          <div class="builder-row"><div class="builder-col" style="flex: 1;"><div class="canvas-element" data-element-type="live-viewers"><div class="canvas-live-viewers-widget" data-min="500" data-max="1000" style="color: #ffffff; text-align: center; font-size: 18px;"><strong class="vsl-viewer-count" style="color:#38bdf8">722</strong> espectadores estão vendo este conteúdo simultaneamente com você</div></div></div></div>
        </div>
      `)
    });
  }
});

const parsedPreview = computed(() => {
  if (!templateForm.htmlCode || templateForm.htmlCode.trim().length < 20) return null;
  try {
    return parseHTMLToBuilderState(templateForm.htmlCode);
  } catch (err) {
    return null;
  }
});

const detectedElementTypes = computed(() => {
  if (!parsedPreview.value) return [];
  const types = new Set();
  parsedPreview.value.rows.forEach(r => {
    r.columns.forEach(c => {
      c.elements.forEach(e => {
        types.add(e.type);
      });
    });
  });
  return Array.from(types);
});

function triggerFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  selectedFileName.value = file.name;
  const reader = new FileReader();
  reader.onload = (event) => {
    templateForm.htmlCode = event.target.result;
    showToast(`📄 Arquivo "${file.name}" carregado!`, 'success');
  };
  reader.readAsText(file);
}

function handleUploadTemplate() {
  if (!templateForm.name || !templateForm.htmlCode) {
    showToast('⚠️ Preencha o nome do template e envie o código HTML!', 'warning');
    return;
  }

  const parsedData = parseHTMLToBuilderState(templateForm.htmlCode);
  const newId = 'template-' + Date.now();

  const newTemplateObj = {
    id: newId,
    key: newId,
    name: templateForm.name,
    category: templateForm.category,
    status: templateForm.status,
    description: templateForm.description,
    date: 'Cadastrado agora',
    json: parsedData
  };

  registerCustomTemplate(newTemplateObj);

  showToast(`🎉 Template "${templateForm.name}" salvo em JSON e publicado no Builder!`, 'success');

  // Reset Form
  templateForm.name = '';
  templateForm.description = '';
  templateForm.htmlCode = '';
  selectedFileName.value = '';
  activeAdminTab.value = 'manage-templates';
}

function openBuilderWorkspace() {
  router.push('/builder');
}

function openTemplateInBuilder(id) {
  if (id) {
    loadTemplate(id);
  }
  router.push('/builder');
}

function downloadJSONFile() {
  if (!parsedPreview.value) return;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(parsedPreview.value, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `${templateForm.name || 'template'}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('💾 Arquivo JSON baixado com sucesso!');
}

function deleteTemplate(id) {
  const idx = customTemplatesRegistry.findIndex(t => t.id === id);
  if (idx !== -1) {
    customTemplatesRegistry.splice(idx, 1);
    try {
      localStorage.setItem('custom_templates_v1', JSON.stringify(customTemplatesRegistry));
    } catch (e) {
      console.warn('Could not save customTemplatesRegistry to localStorage', e);
    }
    showToast('🗑️ Template excluído!', 'info');
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #080c14;
  color: #f8fafc;
  font-family: 'Plus Jakarta Sans', sans-serif;
  overflow: hidden;
}

.admin-sidebar {
  width: 260px;
  background: #0d121f;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-brand {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand-icon {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #ef4444, #f59e0b);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
}

.brand-name { font-size: 17px; font-weight: 800; color: #ffffff; }

.sidebar-menu { padding: 16px 14px; flex: 1; overflow-y: auto; }

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  color: #94a3b8;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.menu-item:hover { background: rgba(255, 255, 255, 0.05); color: #ffffff; }
.menu-item.active { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }

.badge-count { margin-left: auto; background: rgba(255, 255, 255, 0.1); color: #94a3b8; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; }

.sidebar-back-box { padding: 16px 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); }
.btn-back-dashboard {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  padding: 10px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}

.admin-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

.admin-header {
  height: 64px;
  background: #0d121f;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
}

.header-title-box { display: flex; align-items: center; gap: 12px; }
.header-title-box h2 { font-size: 18px; font-weight: 800; }
.admin-badge { background: rgba(239, 68, 68, 0.2); color: #f87171; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; }

.btn-builder-link {
  background: #6366f1;
  color: #fff;
  border: none;
  padding: 9px 18px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-content { flex: 1; overflow-y: auto; padding: 28px; }
.view-header { margin-bottom: 24px; }
.view-header h3 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.view-header p { color: #94a3b8; font-size: 14px; }

.admin-grid-layout { display: grid; grid-template-columns: 1fr 380px; gap: 24px; }
.admin-card-panel { background: rgba(23, 31, 48, 0.75); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 18px; padding: 28px; }

.form-group { margin-bottom: 18px; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 6px; color: #e2e8f0; }

.form-input, .form-select, .code-textarea {
  width: 100%;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px 14px;
  color: #fff;
  font-size: 13.5px;
  outline: none;
}

.file-dropzone {
  border: 2px dashed rgba(99, 102, 241, 0.4);
  background: rgba(99, 102, 241, 0.05);
  border-radius: 14px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.file-dropzone:hover { background: rgba(99, 102, 241, 0.12); border-color: #6366f1; }
.drop-icon { font-size: 32px; color: #818cf8; }
.drop-text { font-size: 13px; color: #cbd5e1; font-weight: 600; }

.code-or-divider {
  text-align: center;
  font-size: 11px;
  font-weight: 800;
  color: #94a3b8;
  margin: 16px 0;
  letter-spacing: 1px;
}

.code-textarea { font-family: monospace; font-size: 12px; line-height: 1.5; color: #a5b4fc; }

.btn-submit-upload {
  width: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  padding: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
}

.preview-panel h4 { font-size: 16px; font-weight: 800; margin-bottom: 2px; }
.panel-subtitle { font-size: 12.5px; color: #94a3b8; margin-bottom: 20px; }

.detail-item { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 8px; }
.detail-label { color: #94a3b8; }
.detail-val { font-weight: 700; color: #fff; display: flex; align-items: center; gap: 6px; }
.color-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }

.elements-found-box { margin-top: 20px; background: rgba(15, 23, 42, 0.6); padding: 14px; border-radius: 10px; margin-bottom: 16px; }
.elements-found-box h5 { font-size: 13px; font-weight: 700; margin-bottom: 8px; }
.elements-found-box ul { list-style: none; font-size: 12.5px; color: #cbd5e1; }
.elements-found-box li { margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
.check-icon { color: #34d399; }

.btn-download-json {
  width: 100%;
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.3);
  padding: 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.empty-parse-box { text-align: center; padding: 40px 10px; color: #94a3b8; }
.empty-parse-icon { font-size: 40px; color: #6366f1; margin-bottom: 10px; display: block; }

.admin-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13.5px; }
.admin-table th { background: rgba(15, 23, 42, 0.8); padding: 12px 16px; color: #94a3b8; font-weight: 700; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
.admin-table td { padding: 14px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.font-bold-td { font-weight: 700; color: #fff; }
.category-pill { background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 6px; }
.status-pill { background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; }
.json-badge { background: rgba(99, 102, 241, 0.2); color: #a5b4fc; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; }
.actions-td { display: flex; align-items: center; gap: 8px; }

.btn-tbl-use {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-tbl-action { background: rgba(239, 68, 68, 0.15); color: #f87171; border: none; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; }

.stats-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
.stat-card-box { background: rgba(23, 31, 48, 0.75); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 16px; }
.stat-icon { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.stat-val { font-size: 28px; font-weight: 800; color: #fff; }
.stat-lbl { font-size: 13px; color: #94a3b8; }
</style>

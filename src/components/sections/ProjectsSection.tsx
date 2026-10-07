import { useState } from 'react';
import { useCVStore } from '../../store/cvStore';

export function ProjectsSection() {
  const { data, addProject, updateProject, removeProject } = useCVStore();
  const [techInput, setTechInput] = useState<Record<string, string>>({});

  const handleAddTech = (projectId: string) => {
    const tech = techInput[projectId]?.trim();
    if (!tech) return;

    const project = data.projects.find((p) => p.id === projectId);
    if (!project) return;

    if (!project.technologies.includes(tech)) {
      updateProject(projectId, 'technologies', [...project.technologies, tech]);
    }

    setTechInput({ ...techInput, [projectId]: '' });
  };

  const handleRemoveTech = (projectId: string, tech: string) => {
    const project = data.projects.find((p) => p.id === projectId);
    if (!project) return;
    updateProject(
      projectId,
      'technologies',
      project.technologies.filter((t) => t !== tech)
    );
  };

  return (
    <div className="section">
      <h2>🚀 Projetos</h2>
      <p className="section-description">
        Adiciona projetos pessoais, académicos ou profissionais.
      </p>

      {data.projects.length === 0 && (
        <div className="empty-state">
          <p>Ainda não adicionaste nenhum projeto.</p>
        </div>
      )}

      {data.projects.map((proj, index) => (
        <div key={proj.id} className="dynamic-card">
          <div className="card-header">
            <h3>Projeto {index + 1}</h3>
            <button
              type="button"
              className="card-remove"
              onClick={() => removeProject(proj.id)}
              title="Remover"
            >
              🗑️
            </button>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Nome do Projeto *</label>
              <input
                type="text"
                value={proj.name}
                onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                placeholder="Ex: App de Gestão de Tarefas"
              />
            </div>

            <div className="form-field">
              <label>Link (opcional)</label>
              <input
                type="url"
                value={proj.link || ''}
                onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                placeholder="Ex: github.com/user/project"
              />
            </div>
          </div>

          <div className="form-field full-width">
            <label>Descrição</label>
            <textarea
              value={proj.description}
              onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
              placeholder="Descreve o projeto, o problema que resolve, o teu papel..."
              rows={3}
            />
          </div>

          <div className="form-field full-width">
            <label>Tecnologias Utilizadas</label>

            <div className="tech-input-row">
              <input
                type="text"
                value={techInput[proj.id] || ''}
                onChange={(e) =>
                  setTechInput({ ...techInput, [proj.id]: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech(proj.id);
                  }
                }}
                placeholder="Ex: React, TypeScript, Node.js"
              />
              <button
                type="button"
                className="btn-tech-add"
                onClick={() => handleAddTech(proj.id)}
              >
                + Adicionar
              </button>
            </div>

            {proj.technologies.length > 0 && (
              <div className="tech-tags">
                {proj.technologies.map((tech, i) => (
                  <span key={i} className="tech-tag">
                    {tech}
                    <button
                      type="button"
                      className="tech-tag-remove"
                      onClick={() => handleRemoveTech(proj.id, tech)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      <button type="button" className="btn-add" onClick={addProject}>
        + Adicionar Projeto
      </button>
    </div>
  );
}
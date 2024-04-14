// src/swagger.json
var openapi = "3.1.0";
var info = {
  title: "API's de Fluxo de Usu\xE1rios, Projetos e Tarefas",
  description: "APIs para registro, login, recupera\xE7\xE3o de senha, cria\xE7\xE3o e visualiza\xE7\xE3o de projetos.",
  version: "1.0.0"
};
var paths = {
  "/register": {
    post: {
      summary: "Cadastrar novo usu\xE1rio",
      description: "Cadastra um novo usu\xE1rio no banco de dados e envia um email de confirma\xE7\xE3o.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                use_email: {
                  type: "string",
                  format: "email",
                  description: "Email do usu\xE1rio"
                },
                use_name: {
                  type: "string",
                  description: "Nome do usu\xE1rio"
                },
                use_password: {
                  type: "string",
                  format: "password",
                  description: "Senha do usu\xE1rio"
                },
                use_confirm_password: {
                  type: "string",
                  format: "password",
                  description: "Confirma\xE7\xE3o da senha do usu\xE1rio"
                }
              },
              required: [
                "use_email",
                "use_name",
                "use_password",
                "use_confirm_password"
              ]
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Cadastro realizado com sucesso"
        },
        "400": {
          description: "Erro ao cadastrar usu\xE1rio"
        }
      }
    }
  },
  "/login": {
    post: {
      summary: "Login de usu\xE1rio",
      description: "Autentica um usu\xE1rio existente no sistema.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                use_email: {
                  type: "string",
                  format: "email",
                  description: "Email do usu\xE1rio"
                },
                use_password: {
                  type: "string",
                  format: "password",
                  description: "Senha do usu\xE1rio"
                }
              },
              required: ["use_email", "use_password"]
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Login efetuado com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Mensagem de sucesso"
                  },
                  acesso: {
                    type: "string",
                    description: "Token de acesso"
                  },
                  use_id: {
                    type: "string",
                    description: "ID do usu\xE1rio"
                  },
                  use_name: {
                    type: "string",
                    description: "Nome do usu\xE1rio"
                  }
                }
              }
            }
          }
        },
        "400": {
          description: "Erro ao efetuar login"
        }
      }
    }
  },
  "/sendemail": {
    post: {
      summary: "Enviar email de recupera\xE7\xE3o de senha",
      description: "Inicia o processo de recupera\xE7\xE3o de senha enviando um email com um c\xF3digo \xFAnico para o usu\xE1rio.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                use_email: {
                  type: "string",
                  format: "email",
                  description: "Email do usu\xE1rio"
                }
              },
              required: ["use_email"]
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Email de recupera\xE7\xE3o enviado com sucesso"
        },
        "400": {
          description: "Erro ao enviar email de recupera\xE7\xE3o"
        }
      }
    }
  },
  "/password-recovery": {
    post: {
      summary: "Recuperar senha",
      description: "Permite a recupera\xE7\xE3o da senha do usu\xE1rio utilizando um c\xF3digo enviado por email.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                use_email: {
                  type: "string",
                  format: "email",
                  description: "Email do usu\xE1rio"
                },
                use_token: {
                  type: "string",
                  description: "C\xF3digo de recupera\xE7\xE3o enviado por email"
                },
                use_password: {
                  type: "string",
                  format: "password",
                  description: "Nova senha do usu\xE1rio"
                },
                use_confirm_password: {
                  type: "string",
                  format: "password",
                  description: "Confirma\xE7\xE3o da nova senha do usu\xE1rio"
                }
              },
              required: [
                "use_email",
                "use_token",
                "use_password",
                "use_confirm_password"
              ]
            }
          }
        },
        responses: {
          "200": {
            description: "Senha atualizada com sucesso"
          },
          "400": {
            description: "Erro ao recuperar senha"
          }
        }
      }
    }
  },
  "/createproject": {
    post: {
      summary: "Criar novo projeto",
      description: "Cria um novo projeto e o associa ao usu\xE1rio autenticado.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                project_name: {
                  type: "string",
                  description: "Nome do projeto"
                },
                project_description: {
                  type: "string",
                  description: "Descri\xE7\xE3o do projeto"
                },
                use_uuid: {
                  type: "string",
                  description: "ID do usu\xE1rio"
                }
              },
              required: ["project_name", "project_description", "use_uuid"]
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Projeto criado com sucesso"
        },
        "400": {
          description: "Erro ao criar projeto"
        },
        "409": {
          description: "O nome do projeto j\xE1 existe"
        }
      }
    }
  },
  "/projectvizualize": {
    post: {
      summary: "Visualizar projetos",
      description: "Retorna uma lista de projetos associados ao usu\xE1rio autenticado.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                use_uuid: {
                  type: "string",
                  description: "ID do usu\xE1rio"
                }
              },
              required: ["use_uuid"]
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Lista de projetos retornada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        project_description: {
                          type: "string",
                          description: "Descri\xE7\xE3o do projeto"
                        },
                        project_name: {
                          type: "string",
                          description: "Nome do projeto"
                        },
                        project_created_at: {
                          type: "string",
                          format: "date",
                          description: "Data de cria\xE7\xE3o do projeto (no formato YYYY-MM-DD)"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "400": {
          description: "Erro ao retornar informa\xE7\xF5es"
        }
      }
    }
  },
  "/createtask": {
    post: {
      summary: "Criar nova tarefa",
      description: "Cria uma nova tarefa associada a um projeto.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                task_description: {
                  type: "string",
                  description: "Descri\xE7\xE3o da tarefa"
                },
                task_title: {
                  type: "string",
                  description: "T\xEDtulo da tarefa"
                },
                task_date_conclude: {
                  type: "string",
                  format: "date",
                  description: "Data de conclus\xE3o da tarefa (opcional)"
                },
                project_uuid: {
                  type: "string",
                  description: "ID do projeto associado \xE0 tarefa"
                }
              },
              required: ["task_description", "task_title", "project_uuid"]
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Tarefa criada com sucesso"
        },
        "400": {
          description: "Erro ao criar tarefa"
        },
        "409": {
          description: "J\xE1 existe uma tarefa com mesmo t\xEDtulo"
        }
      }
    }
  },
  "/taskvizualize": {
    post: {
      summary: "Visualizar tarefas",
      description: "Visualiza as tarefas associadas a um projeto.",
      security: [
        {
          BearerAuth: []
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                project_uuid: {
                  type: "string",
                  description: "ID do projeto"
                }
              },
              required: ["project_uuid"]
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Lista de tarefas retornada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    task_description: {
                      type: "string",
                      description: "Descri\xE7\xE3o da tarefa"
                    },
                    task_title: {
                      type: "string",
                      description: "T\xEDtulo da tarefa"
                    },
                    task_date_conclude: {
                      type: "string",
                      format: "date",
                      description: "Data de conclus\xE3o da tarefa"
                    },
                    project_uuid: {
                      type: "string",
                      description: "ID do projeto associado \xE0 tarefa"
                    }
                  }
                }
              }
            }
          }
        },
        "400": {
          description: "Erro ao retornar informa\xE7\xF5es"
        }
      }
    }
  },
  "/taskconcluded": {
    put: {
      summary: "Concluir tarefa",
      description: "Atualiza o status de conclus\xE3o de uma tarefa.",
      security: [
        {
          BearerAuth: []
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                task_uuid: {
                  type: "string",
                  description: "ID da tarefa"
                },
                task_concluded: {
                  type: "boolean",
                  description: "Status de conclus\xE3o da tarefa"
                }
              },
              required: ["task_uuid", "task_concluded"]
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Status de conclus\xE3o atualizado com sucesso"
        },
        "400": {
          description: "Erro ao concluir a tarefa"
        }
      }
    }
  },
  "/taskexcluded": {
    put: {
      summary: "Excluir/recuperar tarefa",
      description: "Atualiza o status de exclus\xE3o de uma tarefa.",
      security: [
        {
          BearerAuth: []
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                task_uuid: {
                  type: "string",
                  description: "ID da tarefa"
                },
                task_excluded: {
                  type: "boolean",
                  description: "Status de exclus\xE3o da tarefa"
                }
              },
              required: ["task_uuid", "task_excluded"]
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Status de exclus\xE3o atualizado com sucesso"
        },
        "400": {
          description: "Erro ao excluir a tarefa"
        }
      }
    }
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};
var swagger_default = {
  openapi,
  info,
  paths
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  info,
  openapi,
  paths
});

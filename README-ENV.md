# 环境变量配置说明

## 必需的环境变量

请在项目根目录创建 `.env.local` 文件，并配置以下环境变量：

```bash
# Coze API 配置
COZE_API_KEY=你的个人访问令牌
COZE_BOT_ID=7507807163864219688
COZE_SPACE_ID=你的空间ID
COZE_WORKFLOW_ID=你的工作流ID

# 环境配置
NODE_ENV=development
```

## 环境变量说明

### COZE_API_KEY
- **用途**: Coze平台的个人访问令牌(PAT)，用于API认证
- **获取方式**: 在Coze平台的个人设置中生成
- **示例**: `pat_xxxxxxxxxxxxxxxxxxxxxxxxxx`

### COZE_BOT_ID  
- **用途**: 指定要使用的智能体ID
- **值**: `7507807163864219688` (已提供)
- **说明**: 这是您的病历报告生成智能体的ID

### COZE_SPACE_ID
- **用途**: 指定Coze工作空间ID
- **获取方式**: 在Coze平台查看您的工作空间设置
- **说明**: 需要您提供正确的空间ID

### COZE_WORKFLOW_ID
- **用途**: 指定要运行的工作流ID
- **获取方式**: 在Coze平台的智能体工作流设置中查看
- **说明**: 需要您提供正确的工作流ID

### NODE_ENV
- **用途**: 指定Node.js运行环境
- **值**: `development` (开发环境) 或 `production` (生产环境)

## 配置步骤

1. 在项目根目录创建 `.env.local` 文件
2. 复制上面的模板内容到文件中
3. 将 `你的个人访问令牌`、`你的空间ID`、`你的工作流ID` 替换为实际值
4. 保存文件
5. 重启开发服务器

## 注意事项

- `.env.local` 文件已被添加到 `.gitignore`，不会被提交到版本控制
- 请妥善保管您的个人访问令牌，不要泄露给他人
- 生产环境部署时，请通过环境变量或安全的配置管理系统设置这些值

## 验证配置

启动开发服务器后，在浏览器控制台中应该能看到类似以下的配置调试信息：

```
=== Coze 配置调试信息 ===
API Key: pat_xxxxxx...
Bot ID: 7507807163864219688
Space ID: 你的空间ID
Workflow ID: 你的工作流ID
Base URL: https://api.coze.cn/open_api/v1
========================
```

如果看到 "未设置" 或出现错误，请检查环境变量配置是否正确。

## 🎉 最新更新 (工作流参数配置)

### ✅ 工作流变量配置

根据Coze平台的工作流配置，现在使用正确的变量名：

- **BLaudio** (Audio类型) - 音频文件变量
- **BLtemplate** (Doc类型) - 文档文件变量

### 🚀 当前功能状态

- ✅ 文件上传到Coze平台
- ✅ 使用正确参数名执行工作流
- ✅ 报告生成和下载
- ✅ 完整的错误处理和重试机制

### 📝 修改工作流变量

如果需要修改工作流变量名，请在 `lib/config.ts` 中更新：

```typescript
workflowParams: {
  audioParam: "BLaudio", // Audio类型变量名
  docParam: "BLtemplate", // Doc类型变量名
}
```

项目现在应该可以正常工作了！请测试文件上传和报告生成功能。 